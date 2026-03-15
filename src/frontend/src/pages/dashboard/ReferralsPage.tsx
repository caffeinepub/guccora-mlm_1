import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCheck, Copy, Link2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RankBadge } from "../../components/shared/RankBadge";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useAllUsers } from "../../hooks/useQueries";
import { formatDate } from "../../lib/formatters";

export function ReferralsPage() {
  const { identity } = useInternetIdentity();
  const { data: allUsers } = useAllUsers();
  const [copied, setCopied] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString() ?? "";
  const referralLink = `${window.location.origin}/register?sponsor=${myPrincipal}`;

  const myDirectReferrals = (allUsers ?? []).filter(
    (u) => u.sponsorId.toString() === myPrincipal,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-3">
          <Users size={24} className="text-primary" />
          My Referrals
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Share your referral link and earn direct referral bonuses
        </p>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-card border-primary/30 card-glow">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 size={16} className="text-primary" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-muted/30 border-border font-mono text-xs"
              data-ocid="referrals.input"
            />
            <Button
              onClick={handleCopy}
              className={`shrink-0 font-semibold rounded-lg ${
                copied
                  ? "bg-success/20 text-success border border-success/30"
                  : "gold-gradient text-primary-foreground"
              }`}
              data-ocid="referrals.primary_button"
            >
              {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Share this link with potential members. When they register using
            your link, you earn a direct referral bonus.
          </p>
          <div className="p-4 bg-muted/20 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-1">
              Your Principal ID
            </div>
            <div className="font-mono text-xs text-primary break-all">
              {myPrincipal || "Connect wallet to see your ID"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="text-muted-foreground text-sm mb-1">
              Total Referrals
            </div>
            <div className="font-display text-2xl font-bold text-primary">
              {myDirectReferrals.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="text-muted-foreground text-sm mb-1">
              Active Referrals
            </div>
            <div className="font-display text-2xl font-bold text-success">
              {myDirectReferrals.filter((u) => u.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="text-muted-foreground text-sm mb-1">
              Inactive Referrals
            </div>
            <div className="font-display text-2xl font-bold text-muted-foreground">
              {myDirectReferrals.filter((u) => !u.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">
            Direct Referrals ({myDirectReferrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {myDirectReferrals.length === 0 ? (
            <div
              className="p-8 text-center text-muted-foreground"
              data-ocid="referrals.empty_state"
            >
              No referrals yet. Share your link to grow your network!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="referrals.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Member
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Rank
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Position
                    </th>
                    <th className="text-left text-muted-foreground font-medium px-5 py-3">
                      Joined
                    </th>
                    <th className="text-right text-muted-foreground font-medium px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myDirectReferrals.map((user, i) => (
                    <tr
                      key={user.userId.toString()}
                      data-ocid={`referrals.row.${i + 1}`}
                    >
                      <td className="px-5 py-3">
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          @{user.username}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <RankBadge rank={user.rank} size="sm" />
                      </td>
                      <td className="px-5 py-3 capitalize text-muted-foreground">
                        {user.position}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDate(user.joinDate)}
                      </td>
                      <td className="px-5 py-3 text-right">
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
  );
}
