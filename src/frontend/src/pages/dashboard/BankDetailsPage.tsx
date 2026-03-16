import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, CreditCard, Edit, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMobileSession } from "../../hooks/useMobileSession";

const BANK_DETAILS_KEY = "guccora_bank_details";

interface BankDetails {
  phone: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  branchName: string;
}

function loadBankDetails(phone: string): BankDetails | null {
  try {
    const raw = localStorage.getItem(BANK_DETAILS_KEY);
    if (!raw) return null;
    const all: Record<string, BankDetails> = JSON.parse(raw);
    return all[phone] ?? null;
  } catch {
    return null;
  }
}

function saveBankDetailsLocal(details: BankDetails): void {
  try {
    const raw = localStorage.getItem(BANK_DETAILS_KEY);
    const all: Record<string, BankDetails> = raw ? JSON.parse(raw) : {};
    all[details.phone] = details;
    localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function BankDetailsPage() {
  const { mobileSession } = useMobileSession();
  const phone = mobileSession?.phone ?? "";

  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (!phone) return;
    const saved = loadBankDetails(phone);
    if (saved) {
      setAccountHolderName(saved.accountHolderName);
      setBankName(saved.bankName);
      setAccountNumber(saved.accountNumber);
      setIfscCode(saved.ifscCode);
      setUpiId(saved.upiId);
      setBranchName(saved.branchName);
      setIsEditing(false);
      setHasSaved(true);
    }
  }, [phone]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !accountHolderName.trim() ||
      !bankName.trim() ||
      !accountNumber.trim() ||
      !ifscCode.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const details: BankDetails = {
        phone,
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        upiId: upiId.trim(),
        branchName: branchName.trim(),
      };
      saveBankDetailsLocal(details);
      setHasSaved(true);
      setIsEditing(false);
      toast.success("Bank details saved successfully!");
    } catch {
      toast.error("Failed to save bank details");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = isEditing
    ? "bg-black/60 border-yellow-600/40 text-yellow-100 placeholder:text-yellow-900/50 focus:border-yellow-500"
    : "bg-black/30 border-yellow-600/20 text-yellow-200 cursor-default";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
              <Building2 size={20} className="text-black" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold gold-gradient-text">
                Bank Details
              </h1>
              <p className="text-muted-foreground text-sm">
                Save your bank info for withdrawal processing
              </p>
            </div>
          </div>
          {hasSaved && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-600/40 text-yellow-400 hover:bg-yellow-600/10"
              onClick={() => setIsEditing(true)}
              data-ocid="bank.edit_button"
            >
              <Edit size={14} className="mr-1.5" />
              Edit
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-black/80 border border-yellow-600/40 shadow-lg">
          <CardHeader className="border-b border-yellow-600/20">
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <CreditCard size={18} />
              Bank Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-yellow-300/80 text-sm">
                    Account Holder Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Full name as per bank"
                    disabled={!isEditing}
                    className={inputClass}
                    data-ocid="bank.account_holder_input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-300/80 text-sm">
                    Bank Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. State Bank of India"
                    disabled={!isEditing}
                    className={inputClass}
                    data-ocid="bank.bank_name_input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-300/80 text-sm">
                    Account Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    disabled={!isEditing}
                    className={inputClass}
                    data-ocid="bank.account_number_input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-300/80 text-sm">
                    IFSC Code <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001234"
                    disabled={!isEditing}
                    className={inputClass}
                    data-ocid="bank.ifsc_input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-300/80 text-sm">UPI ID</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. name@upi"
                    disabled={!isEditing}
                    className={inputClass}
                    data-ocid="bank.upi_input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-300/80 text-sm">
                    Branch Name
                  </Label>
                  <Input
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. Mumbai Main Branch"
                    disabled={!isEditing}
                    className={inputClass}
                    data-ocid="bank.branch_input"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full gold-gradient text-black font-bold rounded-xl h-11"
                    data-ocid="bank.save_button"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Bank Details
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>

            {hasSaved && !isEditing && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-600/10 border border-yellow-600/30">
                <p className="text-xs text-yellow-400/80 text-center">
                  ✓ Bank details saved. These will be used when processing
                  withdrawal requests.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/50 border border-yellow-600/20">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-400 font-semibold">Note:</span> Your
              bank details are stored securely and only used for processing
              withdrawal requests. Admin will verify details before approving
              payments.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
