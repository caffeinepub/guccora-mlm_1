import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Phone, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Rank } from "../../backend";
import { RankBadge } from "../../components/shared/RankBadge";
import { useActor } from "../../hooks/useActor";
import {
  useAllUsers,
  useSetUserActive,
  useUpdateUserRank,
} from "../../hooks/useQueries";
import { formatDate, truncatePrincipal } from "../../lib/formatters";

interface MobileUser {
  userId: string;
  fullName: string;
  phone: string;
  sponsorCode: string;
  joinDate: bigint | number;
  isActive: boolean;
  walletBalance?: bigint | number;
  totalEarnings?: bigint | number;
}

function useAllMobileUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<MobileUser[]>({
    queryKey: ["allMobileUsers"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).getAllMobileUsers();
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function AdminUsers() {
  const { data: users, isLoading } = useAllUsers();
  const { data: mobileUsers, isLoading: mobileLoading } = useAllMobileUsers();
  const setActiveMutation = useSetUserActive();
  const updateRankMutation = useUpdateUserRank();
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = (users ?? []).filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredMobile = (mobileUsers ?? []).filter(
    (u) =>
      u.fullName.toLowerCase().includes(mobileSearch.toLowerCase()) ||
      u.phone.toLowerCase().includes(mobileSearch.toLowerCase()) ||
      u.userId.toLowerCase().includes(mobileSearch.toLowerCase()),
  );

  const handleToggleActive = async (userId: Principal, current: boolean) => {
    setProcessing(userId.toString());
    try {
      await setActiveMutation.mutateAsync({ userId, isActive: !current });
      toast.success(`User ${current ? "deactivated" : "activated"}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Action failed");
    } finally {
      setProcessing(null);
    }
  };

  const handleRankChange = async (userId: Principal, rank: Rank) => {
    setProcessing(`${userId.toString()}-rank`);
    try {
      await updateRankMutation.mutateAsync({ userId, rank });
      toast.success("Rank updated");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update rank");
    } finally {
      setProcessing(null);
    }
  };

  const formatJoinDate = (ts: bigint | number) => {
    try {
      return new Date(Number(ts)).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-8">
      {/* IC Users Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="font-display text-2xl font-bold flex items-center gap-3">
            <Users size={24} className="text-primary" />
            Manage Users
          </h1>
          <div className="relative flex-1 max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 bg-muted/30 border-border"
              data-ocid="admin.search_input"
            />
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">
              IC Users ({isLoading ? "..." : filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-2" data-ocid="admin.loading_state">
                {["a", "b", "c", "d", "e"].map((k) => (
                  <Skeleton key={k} className="h-14 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="admin.empty_state"
              >
                No IC users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-ocid="admin.table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        Member
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3 hidden md:table-cell">
                        Principal
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        Rank
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3 hidden sm:table-cell">
                        Joined
                      </th>
                      <th className="text-center text-muted-foreground font-medium px-5 py-3">
                        Status
                      </th>
                      <th className="text-right text-muted-foreground font-medium px-5 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((user, i) => (
                      <tr
                        key={user.userId.toString()}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <td className="px-5 py-3">
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            @{user.username}
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="font-mono text-xs text-muted-foreground">
                            {truncatePrincipal(user.userId.toString())}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Select
                            value={user.rank}
                            onValueChange={(val) =>
                              handleRankChange(user.userId, val as Rank)
                            }
                            disabled={
                              processing === `${user.userId.toString()}-rank`
                            }
                          >
                            <SelectTrigger
                              className="w-28 h-7 text-xs bg-muted/30 border-border"
                              data-ocid={`admin.select.${i + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Rank).map((r) => (
                                <SelectItem
                                  key={r}
                                  value={r}
                                  className="text-xs capitalize"
                                >
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground">
                          {formatDate(user.joinDate)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.isActive
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs h-7 border-border ${
                              user.isActive
                                ? "hover:border-destructive/50 hover:text-destructive"
                                : "hover:border-success/50 hover:text-success"
                            }`}
                            onClick={() =>
                              handleToggleActive(user.userId, user.isActive)
                            }
                            disabled={processing === user.userId.toString()}
                            data-ocid={`admin.edit_button.${i + 1}`}
                          >
                            {processing === user.userId.toString() ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : user.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </Button>
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

      {/* Mobile Registered Users Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="font-display text-xl font-bold flex items-center gap-3">
            <Phone size={20} className="text-amber-400" />
            Mobile Registered Users
          </h2>
          <div className="relative flex-1 max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Search mobile users..."
              className="pl-9 bg-muted/30 border-border"
              data-ocid="admin.search_input"
            />
          </div>
        </div>

        <Card className="bg-card border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone size={16} className="text-amber-400" />
              Mobile Users ({mobileLoading ? "..." : filteredMobile.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {mobileLoading ? (
              <div className="p-4 space-y-2" data-ocid="admin.loading_state">
                {["a", "b", "c", "d", "e"].map((k) => (
                  <Skeleton key={k} className="h-14 w-full" />
                ))}
              </div>
            ) : filteredMobile.length === 0 ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="admin.empty_state"
              >
                <Phone
                  size={36}
                  className="mx-auto text-muted-foreground/30 mb-3"
                />
                <p>No mobile registered users yet.</p>
                <p className="text-xs mt-1">
                  Users who register via Mobile OTP will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-ocid="admin.table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        User ID
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        Full Name
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3">
                        Phone
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3 hidden sm:table-cell">
                        Sponsor
                      </th>
                      <th className="text-left text-muted-foreground font-medium px-5 py-3 hidden md:table-cell">
                        Joined
                      </th>
                      <th className="text-center text-muted-foreground font-medium px-5 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMobile.map((user, i) => (
                      <tr
                        key={`mobile-${user.userId}-${i}`}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <td className="px-5 py-3">
                          <span className="font-mono text-sm font-semibold text-primary">
                            {user.userId}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                              {user.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-mono text-xs">
                            {user.phone}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="font-mono text-xs text-muted-foreground">
                            {user.sponsorCode}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">
                          {formatJoinDate(user.joinDate)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.isActive
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
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
    </div>
  );
}
