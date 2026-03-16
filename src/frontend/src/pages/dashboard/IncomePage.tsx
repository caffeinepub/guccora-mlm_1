import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Gift,
  GitBranch,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMobileSession } from "../../hooks/useMobileSession";
import {
  useMobileIncomeStats,
  useMobileUserTransactions,
  useMyIncomeStats,
  useMyTransactions,
  useMyWithdrawalRequests,
} from "../../hooks/useQueries";
import {
  formatDateTime,
  formatRupees,
  txTypeLabel,
} from "../../lib/formatters";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const statCards = [
  {
    key: "totalIncome",
    label: "Total Income",
    icon: TrendingUp,
    gradient: "from-amber-900/30 to-amber-800/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    key: "directReferral",
    label: "Direct Referral",
    icon: Users,
    gradient: "from-amber-800/30 to-amber-700/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    key: "binaryPair",
    label: "Binary Pair",
    icon: GitBranch,
    gradient: "from-amber-900/30 to-amber-800/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    key: "levelIncome",
    label: "Level Income",
    icon: BarChart3,
    gradient: "from-amber-800/30 to-amber-700/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
  {
    key: "rankBonus",
    label: "Bonus Income",
    icon: Gift,
    gradient: "from-amber-900/30 to-amber-800/10",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/20",
  },
];

export function IncomePage() {
  const { mobileSession } = useMobileSession();
  const isMobile = !!mobileSession?.isLoggedIn;

  const { data: icStats, isLoading: icStatsLoading } = useMyIncomeStats();
  const { data: mobileStats, isLoading: mobileStatsLoading } =
    useMobileIncomeStats();
  const { data: icTransactions, isLoading: icTxLoading } = useMyTransactions();
  const { data: mobileTxs, isLoading: mobileTxLoading } =
    useMobileUserTransactions();
  const { data: withdrawals, isLoading: wdLoading } = useMyWithdrawalRequests();

  const stats = isMobile ? mobileStats : icStats;
  const statsLoading = isMobile ? mobileStatsLoading : icStatsLoading;
  const txLoading = isMobile ? mobileTxLoading : icTxLoading;

  const incomeTransactions = isMobile
    ? (mobileTxs ?? []).map((tx, idx) => ({
        transactionId: tx.txId ?? `mtx-${idx}`,
        transactionType: tx.txType,
        amount: BigInt(tx.amount ?? 0),
        date: BigInt(tx.date ?? 0),
        status: "approved" as const,
      }))
    : (icTransactions ?? []).filter(
        (tx) => tx.transactionType !== "withdrawal",
      );

  const getStatValue = (key: string): bigint => {
    if (!stats) return 0n;
    const s = stats as unknown as Record<string, bigint | number>;
    const val = s[key] ?? 0;
    return typeof val === "bigint" ? val : BigInt(val);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <TrendingUp size={20} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-amber-400">
            My Income
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your earnings across all income streams
          </p>
        </div>
      </motion.div>

      {/* Auto-income info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Alert className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <AlertDescription className="text-emerald-200 text-sm">
            <strong className="text-emerald-300">
              Your income is credited automatically.
            </strong>{" "}
            Direct referral income is added when someone joins under you. Binary
            pair income is added when both your left and right legs are filled.
            Level income (up to 10 levels) is credited when your downline grows
            or activates plans.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card
              className={`relative overflow-hidden border ${card.borderColor} bg-gradient-to-br ${card.gradient}`}
            >
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <card.icon size={22} className={card.iconColor} />
                  <span className="text-xs text-muted-foreground font-medium text-right">
                    {card.label}
                  </span>
                </div>
                {statsLoading ? (
                  <Skeleton className="h-7 w-28" />
                ) : (
                  <p className="text-xl font-bold font-display text-foreground">
                    {formatRupees(getStatValue(card.key))}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Income History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <BarChart3 size={18} className="text-amber-400" />
              Income History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {txLoading ? (
              <div className="p-6 space-y-3" data-ocid="income.loading_state">
                {Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <Skeleton key={i} className="h-10 w-full rounded" />
                ))}
              </div>
            ) : incomeTransactions.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="income.empty_state"
              >
                <BarChart3
                  size={40}
                  className="text-muted-foreground/30 mb-3"
                />
                <p className="text-muted-foreground text-sm">
                  No income transactions yet
                </p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Purchase a plan or refer members to start earning
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="income.table">
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-xs uppercase tracking-wider">
                        Type
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider">
                        Date
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-center">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {incomeTransactions.map((tx, idx) => (
                        <motion.tr
                          key={tx.transactionId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-border/30 hover:bg-muted/20 transition-colors"
                          data-ocid={`income.item.${idx + 1}`}
                        >
                          <TableCell className="font-medium text-sm">
                            {txTypeLabel(tx.transactionType)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDateTime(tx.date)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-amber-400">
                            +{formatRupees(tx.amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              Approved
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Withdrawal Requests - only for IC users */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock size={18} className="text-amber-400" />
                My Withdrawal Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {wdLoading ? (
                <div
                  className="p-6 space-y-3"
                  data-ocid="withdrawals.loading_state"
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                    <Skeleton key={i} className="h-10 w-full rounded" />
                  ))}
                </div>
              ) : !withdrawals || withdrawals.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  data-ocid="withdrawals.empty_state"
                >
                  <Clock size={36} className="text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No withdrawal requests yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="withdrawals.table">
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead className="text-xs uppercase tracking-wider">
                          Request ID
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">
                          Amount
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider">
                          Requested
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-center">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((wd, idx) => (
                        <TableRow
                          key={wd.requestId}
                          className="border-border/30 hover:bg-muted/20"
                          data-ocid={`withdrawals.item.${idx + 1}`}
                        >
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {wd.requestId.slice(0, 12)}...
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatRupees(wd.amount)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(wd.requestDate)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              {String(wd.status)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
