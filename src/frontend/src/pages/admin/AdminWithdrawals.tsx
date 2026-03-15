import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, CreditCard, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TransactionStatus } from "../../backend";
import {
  useProcessWithdrawal,
  useWithdrawalRequests,
} from "../../hooks/useQueries";
import { formatDate, formatICP, truncatePrincipal } from "../../lib/formatters";

export function AdminWithdrawals() {
  const { data: withdrawals, isLoading } = useWithdrawalRequests(null);
  const processMutation = useProcessWithdrawal();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleProcess = async (requestId: string, approve: boolean) => {
    setProcessing(requestId);
    try {
      await processMutation.mutateAsync({ requestId, approve });
      toast.success(approve ? "Withdrawal approved" : "Withdrawal rejected");
    } catch (err: any) {
      toast.error(err?.message ?? "Action failed");
    } finally {
      setProcessing(null);
    }
  };

  const statusColor: Record<TransactionStatus, string> = {
    [TransactionStatus.pending]: "bg-yellow-500/20 text-yellow-400",
    [TransactionStatus.approved]: "bg-success/20 text-success",
    [TransactionStatus.rejected]: "bg-destructive/20 text-destructive",
  };

  const pending = (withdrawals ?? []).filter(
    (w) => w.status === TransactionStatus.pending,
  );
  const processed = (withdrawals ?? []).filter(
    (w) => w.status !== TransactionStatus.pending,
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold flex items-center gap-3">
        <CreditCard size={24} className="text-primary" />
        Withdrawal Requests
      </h1>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Pending Requests
            {pending.length > 0 && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                {pending.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="p-4 space-y-2"
              data-ocid="withdrawals.loading_state"
            >
              {["a", "b", "c"].map((k) => (
                <Skeleton key={k} className="h-14 w-full" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="withdrawals.empty_state"
            >
              No pending withdrawal requests.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="withdrawals.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      User
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Amount
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3 hidden md:table-cell">
                      Method
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3 hidden lg:table-cell">
                      Details
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Date
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pending.map((req, i) => (
                    <tr
                      key={req.requestId}
                      data-ocid={`withdrawals.row.${i + 1}`}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {truncatePrincipal(req.userId.toString())}
                      </td>
                      <td className="px-5 py-3 font-semibold text-primary">
                        {formatICP(req.amount)}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        {req.paymentMethod}
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground max-w-[150px] truncate">
                        {req.paymentDetails}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDate(req.requestDate)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-success/20 text-success hover:bg-success/30 border border-success/30"
                            variant="ghost"
                            onClick={() => handleProcess(req.requestId, true)}
                            disabled={processing === req.requestId}
                            data-ocid={`withdrawals.confirm_button.${i + 1}`}
                          >
                            {processing === req.requestId ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 size={12} className="mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30"
                            variant="ghost"
                            onClick={() => handleProcess(req.requestId, false)}
                            disabled={processing === req.requestId}
                            data-ocid={`withdrawals.delete_button.${i + 1}`}
                          >
                            <XCircle size={12} className="mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {processed.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">
              Processed Requests ({processed.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      User
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Amount
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Date
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processed.map((req, i) => (
                    <tr
                      key={req.requestId}
                      data-ocid={`withdrawals.row.${i + 1}`}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {truncatePrincipal(req.userId.toString())}
                      </td>
                      <td className="px-5 py-3 font-semibold">
                        {formatICP(req.amount)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDate(req.requestDate)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[req.status]}`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
