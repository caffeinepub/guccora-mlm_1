import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@dfinity/principal";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Loader2, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Position } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function RegisterPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const sponsorFromUrl = urlParams.get("sponsor") ?? "";

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    sponsorId: sponsorFromUrl,
    position: Position.left,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [adminReady, setAdminReady] = useState<boolean | null>(null);

  // Check whether ADMIN001 has been configured so we can warn early
  useEffect(() => {
    if (!actor) return;
    actor
      .isAdminConfigured()
      .then((ok) => setAdminReady(ok))
      .catch(() => setAdminReady(null));
  }, [actor]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = "Username is required";
    else if (form.username.length < 3) errs.username = "Min 3 characters";
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.sponsorId.trim()) errs.sponsorId = "Sponsor ID is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please sign in first");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      let sponsorPrincipal: Principal;
      try {
        sponsorPrincipal = Principal.fromText(form.sponsorId.trim());
      } catch {
        const resolved = await actor.lookupSponsorByCode(form.sponsorId.trim());
        if (!resolved) {
          // Give a helpful message specific to ADMIN001
          if (form.sponsorId.trim().toUpperCase() === "ADMIN001") {
            toast.error(
              "The root admin (ADMIN001) has not been set up yet. An administrator needs to complete setup at /admin first.",
            );
          } else {
            toast.error("Sponsor code not found. Please check and try again.");
          }
          setLoading(false);
          return;
        }
        sponsorPrincipal = resolved;
      }
      await actor.registerUser(
        form.username.trim(),
        form.fullName.trim(),
        form.email.trim(),
        form.phone.trim(),
        sponsorPrincipal,
        form.position,
        null,
      );
      toast.success("Registration successful. Welcome to GUCCORA!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field])
      setErrors((p) => {
        const n = { ...p };
        delete n[field];
        return n;
      });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <img
            src="/assets/generated/guccora-logo-emblem-transparent.dim_200x200.png"
            alt=""
            className="h-16 w-16 mx-auto object-contain mb-4"
          />
          <h1 className="font-display text-3xl font-bold gold-gradient-text">
            Join GUCCORA
          </h1>
          <p className="text-muted-foreground mt-2">
            Create your account and start building your network
          </p>
        </div>

        {/* Admin not configured warning */}
        {adminReady === false && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 flex gap-3 items-start"
            data-ocid="register.error_state"
          >
            <AlertTriangle
              size={18}
              className="text-amber-400 mt-0.5 shrink-0"
            />
            <div className="text-sm">
              <p className="font-semibold text-amber-300 mb-1">
                Admin not configured yet
              </p>
              <p className="text-amber-200/80">
                The root admin account (ADMIN001) has not been set up. Before
                anyone can register, an administrator must{" "}
                <Link
                  to="/admin"
                  className="underline text-primary font-medium"
                  data-ocid="register.link"
                >
                  go to the Admin page
                </Link>{" "}
                and click &ldquo;Setup GUCCORA Admin&rdquo;.
              </p>
            </div>
          </motion.div>
        )}

        <Card className="bg-card border-border card-glow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus size={20} className="text-primary" />
              Member Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {!identity ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  You must be signed in with Internet Identity to register.
                </p>
                <Button
                  className="gold-gradient text-primary-foreground font-bold rounded-full px-8"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="register.primary_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Sign In First"
                  )}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={form.username}
                      onChange={(e) => set("username", e.target.value)}
                      placeholder="yourhandle"
                      className="bg-muted/30 border-border"
                      data-ocid="register.input"
                    />
                    {errors.username && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="register.error_state"
                      >
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="Jane Doe"
                      className="bg-muted/30 border-border"
                      data-ocid="register.input"
                    />
                    {errors.fullName && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="register.error_state"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="jane@example.com"
                    className="bg-muted/30 border-border"
                    data-ocid="register.input"
                  />
                  {errors.email && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.error_state"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+1 555 000 0000"
                    className="bg-muted/30 border-border"
                    data-ocid="register.input"
                  />
                  {errors.phone && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.error_state"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="sponsorId">Sponsor ID or Code</Label>
                  <Input
                    id="sponsorId"
                    value={form.sponsorId}
                    onChange={(e) => set("sponsorId", e.target.value)}
                    placeholder="ADMIN001 or principal ID"
                    className="bg-muted/30 border-border font-mono text-sm"
                    data-ocid="register.input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use <span className="font-mono text-primary">ADMIN001</span>{" "}
                    to register under the default admin.
                  </p>
                  {errors.sponsorId && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.error_state"
                    >
                      {errors.sponsorId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Position in Sponsor&apos;s Tree</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {([Position.left, Position.right] as Position[]).map(
                      (pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => set("position", pos)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-all capitalize ${
                            form.position === pos
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40"
                          }`}
                          data-ocid={`register.${pos}_button`}
                        >
                          {pos === Position.left
                            ? "\u2190 Left Leg"
                            : "Right Leg \u2192"}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gold-gradient text-primary-foreground font-bold rounded-full py-3 mt-2"
                  disabled={loading || adminReady === false}
                  data-ocid="register.submit_button"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Create My Account"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
