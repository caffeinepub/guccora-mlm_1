import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Phone,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useMobileSession } from "../hooks/useMobileSession";

type Step = "details" | "otp";

export function RegisterPage() {
  const { actor } = useActor();
  const { setMobileSession } = useMobileSession();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const sponsorFromUrl = urlParams.get("sponsor") ?? "";

  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    sponsorId: sponsorFromUrl,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminReady, setAdminReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .isAdminConfigured()
      .then((ok) => setAdminReady(ok))
      .catch(() => setAdminReady(null));
  }, [actor]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (form.phone.length !== 10 || !/^\d{10}$/.test(form.phone))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setLoading(true);
    try {
      const result = await actor.sendOtpToPhone(`+91${form.phone}`);
      if (result === "sent") {
        setGeneratedOtp("");
        toast.success("OTP sent to your mobile number via SMS");
      } else {
        setGeneratedOtp(result);
        toast.success(`OTP: ${result} (Dev mode - SMS not configured)`);
      }
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setLoading(true);
    try {
      const isValid = await actor.verifyPhoneOtp(
        `+91${form.phone}`,
        enteredOtp,
      );
      if (!isValid) {
        toast.error("Incorrect or expired OTP. Please try again.");
        setLoading(false);
        return;
      }
      const sponsorCode = form.sponsorId.trim() || "ADMIN001";
      const userId = await actor.registerMobileUser(
        form.fullName.trim(),
        `+91${form.phone}`,
        form.password,
        sponsorCode,
      );
      const resolvedUserId =
        typeof userId === "string" && userId.length > 0
          ? userId
          : `GC${Date.now().toString().slice(-4)}`;
      setMobileSession({
        userId: resolvedUserId,
        fullName: form.fullName.trim(),
        phone: `+91${form.phone}`,
        sponsorCode,
        joinDate: Date.now(),
      });
      toast.success("Registration successful! Welcome to GUCCORA!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      toast.error(msg);
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
              {step === "otp" ? (
                <>
                  <Phone size={20} className="text-primary" />
                  OTP Verification
                </>
              ) : (
                <>
                  <UserPlus size={20} className="text-primary" />
                  Member Registration
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {step === "details" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="Your full name"
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

                <div className="space-y-1">
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-muted/30 border border-border rounded-md text-sm text-muted-foreground shrink-0">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        set(
                          "phone",
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="10-digit number"
                      className="bg-muted/30 border-border flex-1"
                      maxLength={10}
                      data-ocid="register.input"
                    />
                  </div>
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
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="bg-muted/30 border-border"
                    data-ocid="register.input"
                  />
                  {errors.password && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.error_state"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="Re-enter your password"
                    className="bg-muted/30 border-border"
                    data-ocid="register.input"
                  />
                  {errors.confirmPassword && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="register.error_state"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="sponsorId">
                    Sponsor ID{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="sponsorId"
                    value={form.sponsorId}
                    onChange={(e) => set("sponsorId", e.target.value)}
                    placeholder="ADMIN001 or leave blank"
                    className="bg-muted/30 border-border font-mono text-sm"
                    data-ocid="register.input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to register under the default sponsor{" "}
                    <span className="font-mono text-primary">ADMIN001</span>.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full gold-gradient text-primary-foreground font-bold rounded-full py-3 mt-2"
                  disabled={adminReady === false}
                  data-ocid="register.submit_button"
                >
                  Send OTP
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                    data-ocid="register.link"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                    <Phone size={28} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Registering for:{" "}
                    <span className="text-foreground font-semibold">
                      {form.fullName}
                    </span>
                  </p>
                </div>

                {/* Dev mode OTP display */}
                {generatedOtp && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                    <p className="text-xs text-yellow-300 mb-1">
                      Dev Mode — OTP (SMS not configured)
                    </p>
                    <p className="font-mono text-2xl font-bold tracking-widest text-yellow-200">
                      {generatedOtp}
                    </p>
                  </div>
                )}

                {/* OTP sent confirmation */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-green-400 mt-0.5 shrink-0"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-green-300 mb-0.5">
                      OTP Sent
                    </p>
                    <p className="text-green-200/80">
                      An OTP has been sent to{" "}
                      <span className="font-medium text-green-100">
                        +91-{form.phone.slice(0, 5)}XXXXX
                      </span>
                      . Please check your SMS.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={enteredOtp}
                    onChange={(e) =>
                      setEnteredOtp(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="XXXXXX"
                    className="bg-muted/30 border-border text-center font-mono text-lg tracking-widest"
                    maxLength={6}
                    data-ocid="register.input"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gold-gradient text-primary-foreground font-bold rounded-full"
                  disabled={loading}
                  data-ocid="register.submit_button"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground flex items-center gap-2"
                  onClick={() => {
                    setStep("details");
                    setEnteredOtp("");
                  }}
                  data-ocid="register.secondary_button"
                >
                  <ArrowLeft size={14} />
                  Back to registration form
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
