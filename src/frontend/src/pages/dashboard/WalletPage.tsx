import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  Banknote,
  CheckCircle2,
  Clock,
  Copy,
  PlusCircle,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  RechargeMethod,
  RechargeStatus,
  TransactionStatus,
} from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useMobileSession } from "../../hooks/useMobileSession";
import {
  useMobileUserData,
  useMobileUserTransactions,
  useMyTransactions,
  useRequestWithdrawal,
  useUnifiedWallet,
} from "../../hooks/useQueries";
import {
  formatDateTime,
  formatRupees,
  txStatusLabel,
  txTypeLabel,
} from "../../lib/formatters";

// ── Recharge history hook ──────────────────────────────────────────────────
function useMyRechargeRequests(phone: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myRechargeRequests", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      return (actor as any).getMyRechargeRequests(phone);
    },
    enabled: !!actor && !isFetching && !!phone,
  });
}

// ── Copy helper ───────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-primary hover:text-primary/80 ml-2"
      title="Copy"
    >
      <Copy size={13} />
    </button>
  );
}

export function WalletPage() {
  const { mobileSession } = useMobileSession();
  const isMobile = !!mobileSession?.isLoggedIn;
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: walletLoading } = useUnifiedWallet();
  const { data: mobileData } = useMobileUserData();
  const { data: icTransactions, isLoading: icTxLoading } = useMyTransactions();
  const { data: mobileTxs, isLoading: mobileTxLoading } =
    useMobileUserTransactions();
  const withdrawalMutation = useRequestWithdrawal();

  const { data: rechargeHistory, isLoading: rechargeLoading } =
    useMyRechargeRequests(mobileSession?.phone);

  // Withdrawal form
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Recharge form
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [rechargeTab, setRechargeTab] = useState("upi");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [rechargeLoading2, setRechargeLoading2] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  const transactions = isMobile
    ? (mobileTxs ?? []).map((tx) => ({
        transactionId: tx.txId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionType: tx.txType as any,
        amount: BigInt(tx.amount ?? 0),
        date: BigInt(tx.date ?? 0),
        status: TransactionStatus.approved,
      }))
    : (icTransactions ?? []);

  const txLoading = isMobile ? mobileTxLoading : icTxLoading;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMobile) {
      toast.info(
        "Withdrawal for mobile accounts: please contact admin with your bank details.",
      );
      return;
    }
    const amt = Number.parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!paymentMethod.trim()) {
      toast.error("Enter a payment method");
      return;
    }
    if (!paymentDetails.trim()) {
      toast.error("Enter payment details");
      return;
    }
    if (wallet && amt > Number(wallet.availableBalance)) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      await withdrawalMutation.mutateAsync({
        amount: BigInt(Math.floor(amt)),
        paymentMethod,
        paymentDetails,
      });
      toast.success("Withdrawal request submitted!");
      setAmount("");
      setPaymentMethod("");
      setPaymentDetails("");
      setWithdrawOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Withdrawal failed");
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileSession?.phone) {
      toast.error("You must be logged in with a mobile account to recharge.");
      return;
    }
    const amt = Number.parseFloat(rechargeAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!utrNumber.trim()) {
      toast.error("Enter UTR / Transaction Reference Number");
      return;
    }
    if (rechargeTab === "upi" && !upiId.trim()) {
      toast.error("Enter your UPI ID");
      return;
    }
    if (rechargeTab === "bank" && !bankName.trim()) {
      toast.error("Enter your bank name");
      return;
    }

    setRechargeLoading2(true);
    try {
      await (actor as any).submitRechargeRequest(
        mobileSession.phone,
        BigInt(Math.floor(amt)),
        rechargeTab === "upi" ? "upi" : "bank",
        rechargeTab === "upi" ? upiId : "",
        utrNumber,
        rechargeTab === "bank" ? bankName : "",
      );
      setRechargeSuccess(true);
      setRechargeAmount("");
      setUpiId("");
      setUtrNumber("");
      setBankName("");
      queryClient.invalidateQueries({ queryKey: ["myRechargeRequests"] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to submit recharge request");
    } finally {
      setRechargeLoading2(false);
    }
  };

  const statusColor: Record<TransactionStatus, string> = {
    [TransactionStatus.pending]: "bg-yellow-500/20 text-yellow-400",
    [TransactionStatus.approved]: "bg-success/20 text-success",
    [TransactionStatus.rejected]: "bg-destructive/20 text-destructive",
  };

  const rechargeStatusBadge = (status: RechargeStatus) => {
    if (status === RechargeStatus.approved) return "bg-success/20 text-success";
    if (status === RechargeStatus.rejected)
      return "bg-destructive/20 text-destructive";
    return "bg-yellow-500/20 text-yellow-400";
  };

  const availableBalance =
    isMobile && mobileData
      ? BigInt(mobileData.walletBalance ?? 0)
      : (wallet?.availableBalance ?? 0n);
  const totalEarnings =
    isMobile && mobileData
      ? BigInt(mobileData.totalEarnings ?? 0)
      : (wallet?.totalEarnings ?? 0n);

  const walletCards = [
    {
      label: "Available Balance",
      value: availableBalance,
      icon: Wallet,
      gradient: "from-green-900/30 to-green-800/10",
      border: "border-green-500/20",
      color: "text-green-400",
    },
    {
      label: "Total Earnings",
      value: totalEarnings,
      icon: TrendingUp,
      gradient: "from-green-900/20 to-green-800/5",
      border: "border-green-500/20",
      color: "text-green-400",
    },
    {
      label: "Pending Balance",
      value: wallet?.pendingBalance ?? 0n,
      icon: Clock,
      gradient: "from-green-900/10 to-transparent",
      border: "border-green-500/10",
      color: "text-muted-foreground",
    },
    {
      label: "Withdrawn",
      value: wallet?.withdrawnAmount ?? 0n,
      icon: ArrowDownLeft,
      gradient: "from-green-900/10 to-transparent",
      border: "border-green-500/10",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold flex items-center gap-3">
        <Wallet size={24} className="text-green-400" />
        My Wallet
      </h1>

      {/* ── Add Money Section ── */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/10 border-primary/40 card-glow">
            <CardContent className="p-5">
              {!rechargeOpen ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary font-display tracking-wide">
                      Add Money to Wallet
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Recharge via UPI or Bank Transfer
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setRechargeOpen(true);
                      setRechargeSuccess(false);
                    }}
                    className="bg-primary hover:bg-primary/90 text-background font-bold px-5"
                    data-ocid="recharge.primary_button"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Add Money
                  </Button>
                </div>
              ) : rechargeSuccess ? (
                <div
                  className="text-center py-4"
                  data-ocid="recharge.success_state"
                >
                  <CheckCircle2
                    size={40}
                    className="text-success mx-auto mb-3"
                  />
                  <p className="font-semibold text-success text-lg">
                    Request Submitted!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Admin will verify your payment and credit your wallet
                    shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRechargeOpen(false);
                      setRechargeSuccess(false);
                    }}
                    data-ocid="recharge.close_button"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRecharge} className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-primary font-display tracking-wide">
                      Add Money to Wallet
                    </p>
                    <button
                      type="button"
                      onClick={() => setRechargeOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-xs"
                      data-ocid="recharge.cancel_button"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <div className="space-y-1">
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      placeholder="Enter amount to add"
                      className="bg-muted/30 border-border"
                      data-ocid="recharge.input"
                    />
                  </div>

                  <Tabs value={rechargeTab} onValueChange={setRechargeTab}>
                    <TabsList className="w-full bg-muted/30">
                      <TabsTrigger
                        value="upi"
                        className="flex-1"
                        data-ocid="recharge.tab"
                      >
                        UPI Payment
                      </TabsTrigger>
                      <TabsTrigger
                        value="bank"
                        className="flex-1"
                        data-ocid="recharge.tab"
                      >
                        Bank Transfer
                      </TabsTrigger>
                    </TabsList>

                    {/* UPI Tab */}
                    <TabsContent value="upi" className="space-y-3 mt-4">
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          Pay to UPI ID:
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-primary tracking-wider text-sm">
                            GUCCORA@upi
                          </span>
                          <CopyButton text="GUCCORA@upi" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Send money to the UPI ID above, then enter your
                          details below.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label>Your UPI ID (paid from)</Label>
                        <Input
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@bank"
                          className="bg-muted/30 border-border"
                          data-ocid="recharge.input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>UTR / Transaction Reference Number</Label>
                        <Input
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="12-digit UTR number"
                          className="bg-muted/30 border-border"
                          data-ocid="recharge.input"
                        />
                      </div>
                    </TabsContent>

                    {/* Bank Transfer Tab */}
                    <TabsContent value="bank" className="space-y-3 mt-4">
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-1.5">
                        <p className="text-xs text-muted-foreground mb-1">
                          Transfer to:
                        </p>
                        {(
                          [
                            ["Bank", "State Bank of India"],
                            ["Account No.", "1234567890"],
                            ["IFSC Code", "SBIN0001234"],
                            ["Account Name", "GUCCORA MLM"],
                          ] as [string, string][]
                        ).map(([label, val]) => (
                          <div key={label} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-28">
                              {label}:
                            </span>
                            <span className="font-display font-semibold text-primary text-sm">
                              {val}
                            </span>
                            <CopyButton text={val} />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <Label>UTR / Reference Number</Label>
                        <Input
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="UTR or Reference Number"
                          className="bg-muted/30 border-border"
                          data-ocid="recharge.input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Your Bank Name</Label>
                        <Input
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. State Bank of India"
                          className="bg-muted/30 border-border"
                          data-ocid="recharge.input"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-background font-bold"
                    disabled={rechargeLoading2}
                    data-ocid="recharge.submit_button"
                  >
                    {rechargeLoading2
                      ? "Submitting..."
                      : "Submit Recharge Request"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Wallet Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {walletCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className={`bg-gradient-to-br ${card.gradient} ${card.border} card-glow`}
              data-ocid={`wallet.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-xs">
                    {card.label}
                  </span>
                  <card.icon size={16} className={card.color} />
                </div>
                {walletLoading && !mobileData ? (
                  <Skeleton
                    className="h-6 w-24"
                    data-ocid="wallet.loading_state"
                  />
                ) : (
                  <div
                    className={`font-display font-bold text-lg ${card.color}`}
                  >
                    {formatRupees(card.value)}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Withdraw Button ── */}
      <div className="flex justify-end">
        <Button
          onClick={() => setWithdrawOpen(!withdrawOpen)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-6"
          data-ocid="wallet.open_modal_button"
        >
          <ArrowDownLeft size={16} className="mr-2" />
          Request Withdrawal
        </Button>
      </div>

      {withdrawOpen && (
        <Card
          className="bg-card border-green-500/30 card-glow"
          data-ocid="wallet.dialog"
        >
          <CardHeader>
            <CardTitle className="text-base">Withdrawal Request</CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <div className="text-sm text-muted-foreground bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="font-semibold text-amber-400 mb-1">
                  Mobile Account Withdrawal
                </p>
                <p>
                  To request a withdrawal, please add your bank details in the
                  Bank Details section and contact admin with your User ID:{" "}
                  <span className="font-mono text-primary">
                    {mobileSession?.userId}
                  </span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="bg-muted/30 border-border"
                      data-ocid="wallet.input"
                    />
                    {wallet && (
                      <p className="text-xs text-muted-foreground">
                        Available: {formatRupees(wallet.availableBalance)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>Payment Method</Label>
                    <Input
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      placeholder="UPI / Bank Transfer"
                      className="bg-muted/30 border-border"
                      data-ocid="wallet.input"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Payment Details</Label>
                  <Input
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    placeholder="UPI ID / Account number, IFSC code"
                    className="bg-muted/30 border-border"
                    data-ocid="wallet.input"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                    disabled={withdrawalMutation.isPending}
                    data-ocid="wallet.submit_button"
                  >
                    {withdrawalMutation.isPending
                      ? "Submitting..."
                      : "Submit Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setWithdrawOpen(false)}
                    data-ocid="wallet.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Recharge History (mobile only) ── */}
      {isMobile && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Banknote size={18} className="text-primary" />
              Recharge History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {rechargeLoading ? (
              <div className="p-4 space-y-2" data-ocid="recharge.loading_state">
                {["a", "b", "c"].map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))}
              </div>
            ) : !rechargeHistory || rechargeHistory.length === 0 ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="recharge.empty_state"
              >
                No recharge requests yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-ocid="recharge.table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        Date
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        Method
                      </th>
                      <th className="text-right text-muted-foreground font-medium px-5 py-3">
                        Amount
                      </th>
                      <th className="text-right text-muted-foreground font-medium px-5 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rechargeHistory.map((r: any, i: number) => (
                      <tr key={r.requestId} data-ocid={`recharge.row.${i + 1}`}>
                        <td className="px-5 py-3 text-muted-foreground text-xs">
                          {formatDateTime(BigInt(r.requestDate ?? 0))}
                        </td>
                        <td className="px-5 py-3 capitalize">
                          {r.method === RechargeMethod.upi ? "UPI" : "Bank"}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-primary">
                          +{formatRupees(BigInt(r.amount ?? 0))}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${rechargeStatusBadge(r.status as RechargeStatus)}`}
                          >
                            {r.status === RechargeStatus.approved
                              ? "Approved"
                              : r.status === RechargeStatus.rejected
                                ? "Rejected"
                                : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Transaction History ── */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {txLoading ? (
            <div className="p-4 space-y-2" data-ocid="wallet.loading_state">
              {["a", "b", "c", "d", "e"].map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="wallet.empty_state"
            >
              No transactions yet. Purchase a package to start earning.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="wallet.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Type
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Date
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-5 py-3">
                      Amount
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx, i) => (
                    <tr
                      key={tx.transactionId}
                      data-ocid={`wallet.row.${i + 1}`}
                    >
                      <td className="px-5 py-3 font-medium">
                        {txTypeLabel(tx.transactionType)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDateTime(tx.date)}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-success">
                        +{formatRupees(tx.amount)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            tx.status in statusColor
                              ? statusColor[
                                  tx.status as keyof typeof statusColor
                                ]
                              : "bg-success/20 text-success"
                          }`}
                        >
                          {txStatusLabel(tx.status as TransactionStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
