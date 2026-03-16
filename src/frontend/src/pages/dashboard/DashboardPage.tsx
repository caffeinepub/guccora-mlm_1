import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Gift,
  GitBranch,
  Megaphone,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { RankBadge } from "../../components/shared/RankBadge";
import { useMobileSession } from "../../hooks/useMobileSession";
import {
  useAnnouncements,
  useMobileIncomeStats,
  useMobileUserData,
  useMobileUserTransactions,
  useMyIncomeStats,
  useMyProfile,
  useMyTransactions,
  useUnifiedWallet,
} from "../../hooks/useQueries";
import {
  formatDateTime,
  formatRupees,
  txTypeLabel,
} from "../../lib/formatters";

export function DashboardPage() {
  const { mobileSession } = useMobileSession();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: wallet, isLoading: walletLoading } = useUnifiedWallet();
  const { data: icTransactions, isLoading: icTxLoading } = useMyTransactions();
  const { data: mobileTxs, isLoading: mobileTxLoading } =
    useMobileUserTransactions();
  const { data: announcements } = useAnnouncements();
  const { data: icIncomeStats, isLoading: icIncomeLoading } =
    useMyIncomeStats();
  const { data: mobileIncomeStats, isLoading: mobileIncomeLoading } =
    useMobileIncomeStats();
  const { data: mobileData } = useMobileUserData();

  const isMobile = !!mobileSession?.isLoggedIn;

  // Choose data source based on session type
  const transactions = isMobile
    ? (mobileTxs ?? []).map((tx) => ({
        transactionId: tx.txId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionType: tx.txType as any,
        amount: BigInt(tx.amount ?? 0),
        date: BigInt(tx.date ?? 0),
        status: "approved" as const,
      }))
    : (icTransactions ?? []);

  const txLoading = isMobile ? mobileTxLoading : icTxLoading;
  const incomeLoading = isMobile ? mobileIncomeLoading : icIncomeLoading;

  const incomeStats = isMobile
    ? mobileIncomeStats
    : (icIncomeStats as Record<string, bigint> | null);

  useEffect(() => {
    if (!mobileSession?.isLoggedIn) navigate({ to: "/login" });
  }, [mobileSession, navigate]);

  const recentTx = transactions.slice(0, 5);

  const getIncomeStat = (key: string): bigint => {
    if (!incomeStats) return 0n;
    const s = incomeStats as unknown as Record<string, bigint | number>;
    const val = s[key] ?? 0;
    return typeof val === "bigint" ? val : BigInt(val);
  };

  const displayName =
    mobileSession?.fullName ??
    mobileData?.fullName ??
    profile?.fullName ??
    "Member";
  const isProfileLoading = profileLoading && !mobileSession;

  // Wallet balance: show mobile data if available
  const showWalletBalance = () => {
    if (isMobile && mobileData) {
      return formatRupees(BigInt(mobileData.walletBalance ?? 0));
    }
    if (walletLoading) return null;
    return wallet ? formatRupees(wallet.availableBalance) : "\u20B90";
  };

  const showTotalEarnings = () => {
    if (isMobile && mobileData) {
      return formatRupees(BigInt(mobileData.totalEarnings ?? 0));
    }
    if (walletLoading) return null;
    return wallet ? formatRupees(wallet.totalEarnings) : "\u20B90";
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Welcome back,{" "}
              <span className="gold-gradient-text">
                {isProfileLoading ? "..." : displayName}
              </span>
            </h1>
            {mobileSession?.userId && (
              <p className="text-muted-foreground text-xs mt-0.5 font-mono">
                ID: {mobileSession.userId}
              </p>
            )}
            <p className="text-muted-foreground text-sm mt-1">
              Here&apos;s your network overview.
            </p>
          </div>
          {profile && <RankBadge rank={profile.rank} size="lg" />}
        </div>
      </motion.div>

      {/* Main wallet stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Available Balance",
            value: showWalletBalance(),
            loading: walletLoading && !mobileData,
            icon: Wallet,
            gradient: "from-green-900/30 to-green-800/10",
            border: "border-green-500/20",
            color: "text-green-400",
          },
          {
            label: "Total Earnings",
            value: showTotalEarnings(),
            loading: walletLoading && !mobileData,
            icon: TrendingUp,
            gradient: "from-purple-900/30 to-purple-800/10",
            border: "border-purple-500/20",
            color: "text-purple-400",
          },
          {
            label: "Left Team Count",
            value: profileLoading ? null : "0",
            loading: false,
            icon: Users,
            gradient: "from-purple-900/20 to-purple-800/5",
            border: "border-purple-500/20",
            color: "text-purple-400",
          },
          {
            label: "Right Team Count",
            value: profileLoading ? null : "0",
            loading: false,
            icon: Users,
            gradient: "from-purple-900/20 to-purple-800/5",
            border: "border-purple-500/20",
            color: "text-purple-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className={`bg-gradient-to-br ${stat.gradient} ${stat.border} card-glow`}
              data-ocid={`dashboard.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground text-sm">
                    {stat.label}
                  </span>
                  <stat.icon size={18} className={stat.color} />
                </div>
                {stat.loading || stat.value === null ? (
                  <Skeleton
                    className="h-7 w-28"
                    data-ocid="dashboard.loading_state"
                  />
                ) : (
                  <div
                    className={`font-display text-xl font-bold ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Income breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Direct Referral Income",
            key: "directReferral",
            icon: Users,
          },
          {
            label: "Binary Pair Income",
            key: "binaryPair",
            icon: GitBranch,
          },
          {
            label: "Level Income",
            key: "levelIncome",
            icon: TrendingUp,
          },
          {
            label: "Bonus Income",
            key: "rankBonus",
            icon: Gift,
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 + i * 0.08 }}
          >
            <Card
              className="bg-gradient-to-br from-amber-900/30 to-amber-800/10 border-amber-500/20 card-glow"
              data-ocid={`dashboard.card.${i + 5}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground text-sm">
                    {item.label}
                  </span>
                  <item.icon size={18} className="text-amber-400" />
                </div>
                {incomeLoading ? (
                  <Skeleton
                    className="h-7 w-24"
                    data-ocid="dashboard.loading_state"
                  />
                ) : (
                  <div className="font-display text-xl font-bold text-amber-400">
                    {formatRupees(getIncomeStat(item.key))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">
                Recent Transactions
              </CardTitle>
              <Link
                to="/wallet"
                className="text-xs text-primary hover:underline flex items-center gap-1"
                data-ocid="dashboard.link"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {txLoading ? (
                <div
                  className="p-4 space-y-3"
                  data-ocid="dashboard.loading_state"
                >
                  {["a", "b", "c", "d"].map((k) => (
                    <Skeleton key={k} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentTx.length === 0 ? (
                <div
                  className="p-8 text-center text-muted-foreground"
                  data-ocid="dashboard.empty_state"
                >
                  No transactions yet. Purchase a package to get started.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentTx.map((tx, i) => (
                    <div
                      key={tx.transactionId}
                      className="flex items-center justify-between px-5 py-3"
                      data-ocid={`dashboard.row.${i + 1}`}
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {txTypeLabel(tx.transactionType)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateTime(tx.date)}
                        </div>
                      </div>
                      <div className="font-semibold text-sm text-success">
                        +{formatRupees(tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Megaphone size={16} className="text-primary" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!announcements || announcements.length === 0 ? (
                <div
                  className="p-6 text-center text-muted-foreground text-sm"
                  data-ocid="dashboard.empty_state"
                >
                  No announcements yet.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {(announcements ?? []).slice(0, 5).map((ann, i) => (
                    <div
                      key={`ann-${ann.title}-${i}`}
                      className="px-5 py-3"
                      data-ocid={`dashboard.item.${i + 1}`}
                    >
                      <div className="text-sm font-semibold text-primary mb-1">
                        {ann.title}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
