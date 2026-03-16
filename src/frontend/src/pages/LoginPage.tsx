import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useMobileSession } from "../hooks/useMobileSession";

type Step = "phone" | "otp";

export function LoginPage() {
  const { actor } = useActor();
  const { setMobileSession } = useMobileSession();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setTimeout(() => {
      setStep("otp");
      setLoading(false);
      toast.success("OTP generated (demo mode)");
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      toast.error("Incorrect OTP. Please try again.");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setLoading(true);
    try {
      // Try to find the user by phone number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = await (actor as any).getMobileUserByPhone(`+91${phone}`);
      if (!user || (Array.isArray(user) && user.length === 0)) {
        toast.error("Mobile number not registered. Please register first.");
        setLoading(false);
        return;
      }
      const userData = Array.isArray(user) ? user[0] : user;
      setMobileSession({
        userId: userData.userId ?? "GC0001",
        fullName: userData.fullName ?? "Member",
        phone: `+91${phone}`,
        sponsorCode: userData.sponsorCode ?? "ADMIN001",
        joinDate: Number(userData.joinDate ?? Date.now()),
      });
      toast.success(`Welcome back, ${userData.fullName}!`);
      navigate({ to: "/dashboard" });
    } catch {
      // Fallback: if backend call fails, check localStorage for demo
      toast.error("Login failed. Please check your number or register first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src="/assets/generated/guccora-logo-emblem-transparent.dim_200x200.png"
            alt="GUCCORA"
            className="h-20 w-20 mx-auto object-contain mb-4"
          />
          <h1 className="font-display text-3xl font-bold gold-gradient-text">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your GUCCORA dashboard
          </p>
        </div>

        <Card className="bg-card border-border card-glow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                <Phone size={28} className="text-primary" />
              </div>
              <h2 className="font-semibold text-lg">Mobile OTP Login</h2>
              <p className="text-muted-foreground text-sm text-center mt-1">
                Enter your registered mobile number to receive an OTP
              </p>
            </div>

            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-muted/30 border border-border rounded-md text-sm text-muted-foreground shrink-0">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="10-digit number"
                      className="bg-muted/30 border-border flex-1"
                      maxLength={10}
                      data-ocid="login.input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gold-gradient text-primary-foreground font-bold rounded-full"
                  disabled={loading}
                  data-ocid="login.primary_button"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Demo OTP display */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    OTP sent to{" "}
                    <span className="text-foreground font-medium">
                      +91-{phone.slice(0, 5)}XXXXX
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Demo mode — your OTP is:{" "}
                    <span className="font-mono font-bold text-primary text-base tracking-widest">
                      {generatedOtp}
                    </span>
                  </p>
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
                    data-ocid="login.input"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gold-gradient text-primary-foreground font-bold rounded-full"
                  disabled={loading}
                  data-ocid="login.primary_button"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => {
                    setStep("phone");
                    setEnteredOtp("");
                  }}
                  data-ocid="login.secondary_button"
                >
                  ← Change mobile number
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
                data-ocid="login.link"
              >
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
