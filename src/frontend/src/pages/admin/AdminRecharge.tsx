import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  CheckCircle2,
  Loader2,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RechargeMethod, RechargeStatus } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { formatDateTime, formatRupees } from "../../lib/formatters";

function useAllRechargeRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allRechargeRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getRechargeRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function AdminRecharge() {
  const isAdmin = localStorage.getItem("guccora_admin_session") === "true";
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const { data: allRequests, isLoading } = useAllRechargeRequests();

  const [filterTab, setFilterTab] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  // Manual credit form
  const [creditPhone, setCreditPhone] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);

  if (!isAdmin) {
    return (
      <div
        className="p-8 text-center text-muted-foreground"
        data-ocid="recharge.error_state"
      >
        Access denied. Admin only.
      </div>
    );
  }

  const requests: any[] = allRequests ?? [];

  const filtered = requests.filter((r) => {
    if (filterTab === "all") return true;
    return r.status === filterTab;
  });

  const handleApprove = async (requestId: string) => {
    const note = noteMap[requestId] ?? "";
    setActionLoading(requestId);
    try {
      await (actor as any).approveRechargeRequest(requestId, note);
      toast.success("Recharge approved and wallet credited.");
      queryClient.invalidateQueries({ queryKey: ["allRechargeRequests"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = noteMap[requestId] ?? "";
    if (!reason.trim()) {
      toast.error("Enter a rejection reason.");
      return;
    }
    setActionLoading(requestId);
    try {
      await (actor as any).rejectRechargeRequest(requestId, reason);
      toast.success("Recharge request rejected.");
      queryClient.invalidateQueries({ queryKey: ["allRechargeRequests"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Rejection failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleManualCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditPhone.trim()) {
      toast.error("Enter phone number");
      return;
    }
    const amt = Number.parseFloat(creditAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    setCreditLoading(true);
    try {
      await (actor as any).adminCreditWallet(
        creditPhone,
        BigInt(Math.floor(amt)),
        creditNote,
      );
      toast.success(`₹${amt} credited to ${creditPhone} successfully.`);
      setCreditPhone("");
      setCreditAmount("");
      setCreditNote("");
    } catch (err: any) {
      toast.error(err?.message ?? "Credit failed");
    } finally {
      setCreditLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === RechargeStatus.approved) return "bg-success/20 text-success";
    if (status === RechargeStatus.rejected)
      return "bg-destructive/20 text-destructive";
    return "bg-yellow-500/20 text-yellow-400";
  };

  const pendingCount = requests.filter(
    (r) => r.status === RechargeStatus.pending,
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold flex items-center gap-3">
        <Banknote size={24} className="text-primary" />
        Recharge Requests
      </h1>

      {/* ── Manual Credit Card ── */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-yellow-900/10 border-primary/40 card-glow">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PlusCircle size={18} className="text-primary" />
            Manual Wallet Credit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleManualCredit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="space-y-1">
              <Label>User Phone Number</Label>
              <Input
                value={creditPhone}
                onChange={(e) => setCreditPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="bg-muted/30 border-border"
                data-ocid="recharge.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                min="1"
                step="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="0"
                className="bg-muted/30 border-border"
                data-ocid="recharge.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Note / Reason</Label>
              <Input
                value={creditNote}
                onChange={(e) => setCreditNote(e.target.value)}
                placeholder="Optional note"
                className="bg-muted/30 border-border"
                data-ocid="recharge.input"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-background font-bold px-6"
                disabled={creditLoading}
                data-ocid="recharge.submit_button"
              >
                {creditLoading ? (
                  <>
                    <Loader2 size={15} className="mr-2 animate-spin" />
                    Crediting...
                  </>
                ) : (
                  <>
                    <PlusCircle size={15} className="mr-2" />
                    Credit Wallet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Recharge Requests Table ── */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Recharge Requests
            {pendingCount > 0 && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                {pendingCount} Pending
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-5 pt-4">
            <Tabs value={filterTab} onValueChange={setFilterTab}>
              <TabsList className="bg-muted/30">
                <TabsTrigger value="all" data-ocid="recharge.tab">
                  All
                </TabsTrigger>
                <TabsTrigger
                  value={RechargeStatus.pending}
                  data-ocid="recharge.tab"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value={RechargeStatus.approved}
                  data-ocid="recharge.tab"
                >
                  Approved
                </TabsTrigger>
                <TabsTrigger
                  value={RechargeStatus.rejected}
                  data-ocid="recharge.tab"
                >
                  Rejected
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filterTab} className="mt-0 pb-0">
                {isLoading ? (
                  <div
                    className="p-4 space-y-2"
                    data-ocid="recharge.loading_state"
                  >
                    {["a", "b", "c"].map((k) => (
                      <Skeleton key={k} className="h-12 w-full" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div
                    className="py-10 text-center text-muted-foreground"
                    data-ocid="recharge.empty_state"
                  >
                    No recharge requests found.
                  </div>
                ) : (
                  <div
                    className="overflow-x-auto mt-4"
                    data-ocid="recharge.table"
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            Phone
                          </th>
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            Amount
                          </th>
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            Method
                          </th>
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            UTR / Ref
                          </th>
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            Date
                          </th>
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            Status
                          </th>
                          <th className="text-left text-muted-foreground font-medium px-4 py-3">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filtered.map((req: any, i: number) => (
                          <tr
                            key={req.requestId}
                            data-ocid={`recharge.row.${i + 1}`}
                          >
                            <td className="px-4 py-3 font-mono text-xs">
                              {req.phone}
                            </td>
                            <td className="px-4 py-3 font-semibold text-primary">
                              {formatRupees(BigInt(req.amount ?? 0))}
                            </td>
                            <td className="px-4 py-3 capitalize">
                              {req.method === RechargeMethod.upi
                                ? "UPI"
                                : "Bank"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                              {req.utrNumber || req.bankName || "—"}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {formatDateTime(BigInt(req.requestDate ?? 0))}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(req.status)}`}
                              >
                                {req.status === RechargeStatus.approved
                                  ? "Approved"
                                  : req.status === RechargeStatus.rejected
                                    ? "Rejected"
                                    : "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {req.status === RechargeStatus.pending ? (
                                <div className="flex flex-col gap-2 min-w-[180px]">
                                  <Textarea
                                    rows={1}
                                    value={noteMap[req.requestId] ?? ""}
                                    onChange={(e) =>
                                      setNoteMap((prev) => ({
                                        ...prev,
                                        [req.requestId]: e.target.value,
                                      }))
                                    }
                                    placeholder="Note / reason (required for reject)"
                                    className="text-xs bg-muted/30 border-border resize-none"
                                    data-ocid="recharge.textarea"
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleApprove(req.requestId)
                                      }
                                      disabled={actionLoading === req.requestId}
                                      className="bg-success/20 hover:bg-success/30 text-success border border-success/40 font-semibold flex-1"
                                      data-ocid="recharge.confirm_button"
                                    >
                                      {actionLoading === req.requestId ? (
                                        <Loader2
                                          size={13}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <>
                                          <CheckCircle2
                                            size={13}
                                            className="mr-1"
                                          />
                                          Approve
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleReject(req.requestId)
                                      }
                                      disabled={actionLoading === req.requestId}
                                      className="bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/40 font-semibold flex-1"
                                      data-ocid="recharge.delete_button"
                                    >
                                      <XCircle size={13} className="mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {req.adminNote || "—"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
