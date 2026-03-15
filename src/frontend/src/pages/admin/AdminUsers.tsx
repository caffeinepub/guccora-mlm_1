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
import { Loader2, Search, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Rank } from "../../backend";
import { RankBadge } from "../../components/shared/RankBadge";
import {
  useAllUsers,
  useSetUserActive,
  useUpdateUserRank,
} from "../../hooks/useQueries";
import { formatDate, truncatePrincipal } from "../../lib/formatters";

export function AdminUsers() {
  const { data: users, isLoading } = useAllUsers();
  const setActiveMutation = useSetUserActive();
  const updateRankMutation = useUpdateUserRank();
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = (users ?? []).filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
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

  return (
    <div className="space-y-6">
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
            Users ({isLoading ? "..." : filtered.length})
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
              No users found.
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
  );
}
