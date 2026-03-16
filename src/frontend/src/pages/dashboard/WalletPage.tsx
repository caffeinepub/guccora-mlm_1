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

export function WalletPage() {
  const { mobileSession } = useMobileSession();
  const isMobile = !!mobileSession?.isLoggedIn;

  const { data: wallet, isLoading: walletLoading } = useUnifiedWallet();
  const { data: mobileData } = useMobileUserData();
  const { data: icTransactions, isLoading: icTxLoading } = useMyTransactions();
  const { data: mobileTxs, isLoading: mobileTxLoading } =
    useMobileUserTransactions();
  const withdrawalMutation = useRequestWithdrawal();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);

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
      const amountBigint = BigInt(Math.floor(amt));
      await withdrawalMutation.mutateAsync({
        amount: amountBigint,
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

  const statusColor: Record<TransactionStatus, string> = {
    [TransactionStatus.pending]: "bg-yellow-500/20 text-yellow-400",
    [TransactionStatus.approved]: "bg-success/20 text-success",
    [TransactionStatus.rejected]: "bg-destructive/20 text-destructive",
  };

  // Show wallet values: prefer mobile data if mobile session
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
