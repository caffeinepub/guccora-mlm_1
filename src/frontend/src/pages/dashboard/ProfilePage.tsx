import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../../backend";
import { RankBadge } from "../../components/shared/RankBadge";
import { useMobileSession } from "../../hooks/useMobileSession";
import { useMyProfile, useSaveProfile } from "../../hooks/useQueries";

export function ProfilePage() {
  const { mobileSession } = useMobileSession();
  const { data: profile, isLoading } = useMyProfile();
  const saveProfileMutation = useSaveProfile();

  const [form, setForm] = useState({
    username: "",
    fullName: mobileSession?.fullName ?? "",
    email: "",
    phone: mobileSession?.phone ?? "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username,
        fullName: profile.fullName || mobileSession?.fullName || "",
        email: profile.email,
        phone: profile.phone || mobileSession?.phone || "",
      });
    }
  }, [profile, mobileSession]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updated: UserProfile = {
        ...profile,
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };
      await saveProfileMutation.mutateAsync(updated);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save profile");
    }
  };

  const displayName = form.fullName || mobileSession?.fullName || "Member";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold flex items-center gap-3">
        <User size={24} className="text-primary" />
        My Profile
      </h1>

      <Card className="bg-card border-border card-glow">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
              {initials}
            </div>
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : (
                <>
                  <h2 className="font-display text-lg font-bold">
                    {displayName}
                  </h2>
                  {mobileSession?.userId && (
                    <p className="text-xs text-primary font-mono mt-0.5">
                      {mobileSession.userId}
                    </p>
                  )}
                  {profile && (
                    <RankBadge rank={profile.rank} size="md" className="mt-1" />
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4" data-ocid="profile.loading_state">
              {["a", "b", "c", "d"].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Username</Label>
                  <Input
                    value={form.username}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, username: e.target.value }))
                    }
                    className="bg-muted/30 border-border"
                    data-ocid="profile.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className="bg-muted/30 border-border"
                    data-ocid="profile.input"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="bg-muted/30 border-border"
                  data-ocid="profile.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="bg-muted/30 border-border"
                  data-ocid="profile.input"
                />
              </div>

              {mobileSession?.sponsorCode && (
                <div className="space-y-1">
                  <Label>Sponsor Code</Label>
                  <div className="px-3 py-2 bg-muted/20 border border-border rounded-md font-mono text-sm text-muted-foreground">
                    {mobileSession.sponsorCode}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="gold-gradient text-primary-foreground font-semibold rounded-full px-6"
                  disabled={saveProfileMutation.isPending}
                  data-ocid="profile.save_button"
                >
                  {saveProfileMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {profile && (
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3">Account Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Status: </span>
                <span
                  className={
                    profile.isActive
                      ? "text-success font-medium"
                      : "text-destructive font-medium"
                  }
                >
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Rank: </span>
                <RankBadge rank={profile.rank} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
