import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Loader2, Shield, TrendingUp, UserCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  useCreateFirstAdmin,
  useGlobalStats,
  useIsAdmin,
} from "../../hooks/useQueries";
import { formatICP } from "../../lib/formatters";

export function AdminDashboard() {
  const { data: stats, isLoading } = useGlobalStats();
  const { data: isAdmin } = useIsAdmin();
  const createAdminMutation = useCreateFirstAdmin();

  const handleCreateAdmin = async () => {
    try {
      await createAdminMutation.mutateAsync();
      toast.success(
        "GUCCORA Admin account created! Sponsor code ADMIN001 is now active.",
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create admin");
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats ? Number(stats.totalUsers).toLocaleString() : null,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Active Users",
      value: stats ? Number(stats.activeUsers).toLocaleString() : null,
      icon: UserCheck,
      color: "text-success",
    },
    {
      label: "Total Paid Out",
      value: stats ? formatICP(stats.totalPaidOut) : null,
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <Shield size={24} className="text-primary" />
          Admin Overview
        </h1>
        {!isAdmin && (
          <div className="flex flex-col items-end">
            <Button
              onClick={handleCreateAdmin}
              className="gold-gradient text-primary-foreground font-semibold"
              disabled={createAdminMutation.isPending}
              data-ocid="admin.primary_button"
            >
              {createAdminMutation.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Setup GUCCORA Admin"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Username: admin · Sponsor Code: ADMIN001 · Role: Super Admin
            </p>
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
              className="bg-card border-border card-glow"
              data-ocid={`admin.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground text-sm">
                    {card.label}
                  </span>
                  <card.icon size={18} className={card.color} />
                </div>
                {isLoading || card.value === null ? (
                  <Skeleton
                    className="h-8 w-28"
                    data-ocid="admin.loading_state"
                  />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        ].map((item, i) => (
          <Link key={item.to} to={item.to} data-ocid={`admin.link.${i + 1}`}>
            <Card className="bg-card border-border hover:border-primary/40 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <item.icon size={20} className="text-primary mb-3" />
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
