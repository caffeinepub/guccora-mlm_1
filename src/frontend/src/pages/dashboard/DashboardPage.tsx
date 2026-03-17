import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Award,
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

const PLAN_MAP: Record<number, { name: string; price: number }> = {
  1: { name: "Starter Plan", price: 499 },
  2: { name: "Silver Plan", price: 999 },
  3: { name: "Gold Plan", price: 1999 },
  4: { name: "Diamond Plan", price: 2999 },
};

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

  // Active plan
  const activePlanId: number | null =
    mobileData?.activePlanId != null ? Number(mobileData.activePlanId) : null;
  const activePlan = activePlanId != null ? PLAN_MAP[activePlanId] : null;
  const activationDateMs: number | null =
    mobileData?.activationDate != null
      ? Number(mobileData.activationDate)
      : null;
  const activationDateFormatted =
    activationDateMs && activationDateMs > 0
      ? formatDateTime(BigInt(activationDateMs) * 1_000_000n)
      : null;

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

      {/* Active Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <Card
          className="bg-gradient-to-br from-amber-900/40 via-yellow-900/20 to-amber-800/10 border-amber-500/30 card-glow"
          data-ocid="dashboard.active_plan.card"
        >
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Award size={22} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-muted-foreground text-xs mb-1 font-medium uppercase tracking-wide">
                    My Active Plan
                  </div>
                  {activePlan ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-amber-300">
                          {activePlan.name}
                        </span>
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          ACTIVE
                        </span>
                      </div>
                      <div className="text-amber-400 font-bold text-base">
                        ₹{activePlan.price.toLocaleString("en-IN")}
                      </div>
                      {activationDateFormatted ? (
                        <div className="text-muted-foreground text-xs mt-0.5">
                          Activated: {activationDateFormatted}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-xs mt-0.5">
                          Activated: —
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="font-display text-base font-semibold text-muted-foreground">
                        No Active Plan
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        Purchase a plan to activate your MLM account.
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {activePlan ? (
                  activePlanId !== null && activePlanId >= 4 ? (
                    <div className="text-xs text-amber-400 font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                      ⭐ Top Plan — No upgrade needed
                    </div>
                  ) : (
                    <Link
                      to="/packages"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/50 text-amber-400 text-sm font-semibold hover:bg-amber-500/10 transition-colors"
                      data-ocid="dashboard.active_plan.button"
                    >
                      <ArrowUpRight size={15} />
                      Upgrade Plan
                    </Link>
                  )
                ) : (
                  <Link
                    to="/packages"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
                    data-ocid="dashboard.active_plan.button"
                  >
                    Get Started
                    <ArrowUpRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
