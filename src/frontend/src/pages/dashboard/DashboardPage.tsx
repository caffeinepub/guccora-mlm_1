import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Megaphone,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { RankBadge } from "../../components/shared/RankBadge";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAnnouncements,
  useMyProfile,
  useMyTransactions,
  useMyWallet,
} from "../../hooks/useQueries";
import { formatDateTime, formatICP, txTypeLabel } from "../../lib/formatters";

export function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: wallet, isLoading: walletLoading } = useMyWallet();
  const { data: transactions, isLoading: txLoading } = useMyTransactions();
  const { data: announcements } = useAnnouncements();

  useEffect(() => {
    if (!identity) navigate({ to: "/login" });
  }, [identity, navigate]);

  const recentTx = (transactions ?? []).slice(0, 5);

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
                {profileLoading ? "..." : (profile?.fullName ?? "Member")}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here&apos;s your network overview.
            </p>
          </div>
          {profile && <RankBadge rank={profile.rank} size="lg" />}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Available Balance",
            value: walletLoading
              ? null
              : wallet
                ? formatICP(wallet.availableBalance)
                : "0.00 ICP",
            icon: Wallet,
            color: "text-primary",
          },
          {
            label: "Total Earnings",
            value: walletLoading
              ? null
              : wallet
                ? formatICP(wallet.totalEarnings)
                : "0.00 ICP",
            icon: TrendingUp,
            color: "text-success",
          },
          {
            label: "Left Leg Volume",
            value: profileLoading ? null : profile ? "0.00 ICP" : "—",
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Right Leg Volume",
            value: profileLoading ? null : profile ? "0.00 ICP" : "—",
            icon: Users,
            color: "text-primary",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className="bg-card border-border card-glow"
              data-ocid={`dashboard.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground text-sm">
                    {stat.label}
                  </span>
                  <stat.icon size={18} className={stat.color} />
                </div>
                {stat.value === null ? (
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
                      <div
                        className={`font-semibold text-sm ${tx.transactionType === "withdrawal" ? "text-destructive" : "text-success"}`}
                      >
                        {tx.transactionType === "withdrawal" ? "-" : "+"}
                        {formatICP(tx.amount)}
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
