import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, Clock, TrendingUp, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TransactionStatus } from "../../backend";
import {
  useMyTransactions,
  useMyWallet,
  useRequestWithdrawal,
} from "../../hooks/useQueries";
import {
  formatDateTime,
  formatICP,
  txStatusLabel,
  txTypeLabel,
} from "../../lib/formatters";

export function WalletPage() {
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: transactions, isLoading: txLoading } = useMyTransactions();
  const withdrawalMutation = useRequestWithdrawal();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (wallet && amt > Number(wallet.availableBalance) / 100_000_000) {
      toast.error("Insufficient balance");
      return;
    }
    try {
      const amountE8s = BigInt(Math.floor(amt * 100_000_000));
      await withdrawalMutation.mutateAsync({
        amount: amountE8s,
        paymentMethod,
        paymentDetails,
      });
      toast.success("Withdrawal request submitted!");
      setAmount("");
      setPaymentMethod("");
      setPaymentDetails("");
      setWithdrawOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Withdrawal failed");
    }
  };

  const statusColor: Record<TransactionStatus, string> = {
    [TransactionStatus.pending]: "bg-yellow-500/20 text-yellow-400",
    [TransactionStatus.approved]: "bg-success/20 text-success",
    [TransactionStatus.rejected]: "bg-destructive/20 text-destructive",
  };

  const walletCards = [
    {
      label: "Available Balance",
      key: "availableBalance" as const,
      icon: Wallet,
      positive: true,
    },
    {
      label: "Total Earnings",
      key: "totalEarnings" as const,
      icon: TrendingUp,
      positive: true,
    },
    {
      label: "Pending Balance",
      key: "pendingBalance" as const,
      icon: Clock,
      positive: false,
    },
    {
      label: "Withdrawn",
      key: "withdrawnAmount" as const,
      icon: ArrowDownLeft,
      positive: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold flex items-center gap-3">
        <Wallet size={24} className="text-primary" />
        My Wallet
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {walletCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className="bg-card border-border card-glow"
              data-ocid={`wallet.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-xs">
                    {card.label}
                  </span>
                  <card.icon
                    size={16}
                    className={
                      card.positive ? "text-primary" : "text-muted-foreground"
                    }
                  />
                </div>
                {walletLoading ? (
                  <Skeleton
                    className="h-6 w-24"
                    data-ocid="wallet.loading_state"
                  />
                ) : (
                  <div
                    className={`font-display font-bold text-lg ${card.positive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {wallet ? formatICP(wallet[card.key]) : "0.00 ICP"}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setWithdrawOpen(!withdrawOpen)}
          className="gold-gradient text-primary-foreground font-semibold rounded-full px-6"
          data-ocid="wallet.open_modal_button"
        >
          <ArrowDownLeft size={16} className="mr-2" />
          Request Withdrawal
        </Button>
      </div>

      {withdrawOpen && (
        <Card
          className="bg-card border-primary/30 card-glow"
          data-ocid="wallet.dialog"
        >
          <CardHeader>
            <CardTitle className="text-base">Withdrawal Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Amount (ICP)</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-muted/30 border-border"
                    data-ocid="wallet.input"
                  />
                  {wallet && (
                    <p className="text-xs text-muted-foreground">
                      Available: {formatICP(wallet.availableBalance)}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Payment Method</Label>
                  <Input
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="Bank Transfer / Crypto"
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
                  placeholder="Account number, wallet address, etc."
                  className="bg-muted/30 border-border"
                  data-ocid="wallet.input"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="gold-gradient text-primary-foreground font-semibold"
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
          </CardContent>
        </Card>
      )}

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
              No transactions yet.
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
                      <td
                        className={`px-5 py-3 text-right font-semibold ${tx.transactionType === "withdrawal" ? "text-destructive" : "text-success"}`}
                      >
                        {tx.transactionType === "withdrawal" ? "-" : "+"}
                        {formatICP(tx.amount)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[tx.status]}`}
                        >
                          {txStatusLabel(tx.status)}
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
