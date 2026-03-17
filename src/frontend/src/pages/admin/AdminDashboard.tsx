import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Loader2,
  Network,
  RefreshCw,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import {
  useCreateFirstAdmin,
  useGlobalStats,
  useIsAdminConfigured,
} from "../../hooks/useQueries";
import { formatRupees } from "../../lib/formatters";

export function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching: actorLoading, isError: actorError } = useActor();
  const { data: stats, isLoading: statsLoading } = useGlobalStats();
  const { data: isAdminConfigured, isFetching: isAdminCheckLoading } =
    useIsAdminConfigured();
  const createAdminMutation = useCreateFirstAdmin();

  const isStatsLoading = actorLoading || statsLoading || !actor;
  const actorNotReady = actorLoading || !actor;
  const backendUnavailable = !actorLoading && !actor;

  const handleRetryConnection = () => {
    queryClient.refetchQueries({ queryKey: ["actor"] });
    toast.info("Retrying backend connection…");
  };

  const handleCreateAdmin = async () => {
    if (!actor) {
      toast.error("Backend not connected. Please wait and try again.");
      return;
    }
    try {
      await createAdminMutation.mutateAsync();
      toast.success("GUCCORA Admin account created! Redirecting to login…");
      setTimeout(() => {
        navigate({ to: "/admin-login" });
      }, 1500);
    } catch (err: any) {
      const msg = err?.message ?? "Failed to create admin";
      if (msg.toLowerCase().includes("already exists")) {
        toast.info("Admin already set up. Redirecting to login…");
        setTimeout(() => navigate({ to: "/admin-login" }), 1000);
      } else {
        toast.error(msg);
      }
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats ? Number(stats.totalUsers).toLocaleString() : null,
      icon: Users,
      color: "text-red-400",
    },
    {
      label: "Active Users",
      value: stats ? Number(stats.activeUsers).toLocaleString() : null,
      icon: UserCheck,
      color: "text-red-400",
    },
    {
      label: "Total Paid Out",
      value: stats ? formatRupees(stats.totalPaidOut) : null,
      icon: TrendingUp,
      color: "text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <Shield size={24} className="text-red-400" />
          Admin Overview
        </h1>

        {/* Connection / Setup button area */}
        {actorLoading ? (
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-ocid="admin.loading_state"
          >
            <Wifi size={14} className="animate-pulse text-amber-400" />
            Connecting to backend…
          </div>
        ) : backendUnavailable || actorError ? (
          <div
            className="flex items-center gap-2"
            data-ocid="admin.error_state"
          >
            <span className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle size={14} />
              Backend unavailable
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetryConnection}
              className="h-7 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
              data-ocid="admin.secondary_button"
            >
              <RefreshCw size={12} className="mr-1" />
              Retry
            </Button>
          </div>
        ) : isAdminCheckLoading ? (
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            data-ocid="admin.loading_state"
          >
            <Loader2 size={14} className="animate-spin text-amber-400" />
            Checking setup status…
          </div>
        ) : !isAdminConfigured ? (
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={handleCreateAdmin}
              className="gold-gradient text-primary-foreground font-semibold"
              disabled={createAdminMutation.isPending || actorNotReady}
              data-ocid="admin.primary_button"
            >
              {createAdminMutation.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Setting up…
                </>
              ) : (
                "Setup GUCCORA Admin"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Username: admin · Password: Admin@123 · Sponsor: ADMIN001
            </p>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 text-sm text-emerald-400"
            data-ocid="admin.success_state"
          >
            <Shield size={14} />
            Admin configured
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className="bg-card border-red-500/20 card-glow"
              data-ocid={`admin.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground text-sm">
                    {card.label}
                  </span>
                  <card.icon size={18} className={card.color} />
                </div>
                {isStatsLoading || card.value === null ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <div
                    className={`font-display text-2xl font-bold ${card.color}`}
                  >
                    {card.value}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            to: "/admin/users",
            label: "Manage Users",
            icon: Users,
            desc: "View and manage all members",
          },
          {
            to: "/admin/withdrawals",
            label: "Withdrawals",
            icon: TrendingUp,
            desc: "Process withdrawal requests",
          },
          {
            to: "/admin/announcements",
            label: "Announcements",
            icon: Shield,
            desc: "Post community announcements",
          },
          {
            to: "/admin/packages",
            label: "Packages",
            icon: UserCheck,
            desc: "Manage membership packages",
          },
          {
            to: "/admin/products",
            label: "Products",
            icon: UserCheck,
            desc: "Manage product catalog",
          },
          {
            to: "/admin/income",
            label: "Income Reports",
            icon: TrendingUp,
            desc: "View and manage income distribution",
          },
          {
            to: "/admin/tree",
            label: "Tree View",
            icon: Network,
            desc: "Visual binary tree structure",
          },
        ].map((item, i) => (
          <Link key={item.to} to={item.to} data-ocid={`admin.link.${i + 1}`}>
            <Card className="bg-card border-red-500/10 hover:border-red-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <item.icon size={20} className="text-red-400 mb-3" />
                <div className="font-semibold text-sm mb-1">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
