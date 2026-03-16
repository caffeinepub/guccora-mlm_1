import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, Phone, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMobileSession } from "../hooks/useMobileSession";

export function LoginPage() {
  const { login, identity, isLoggingIn, isLoginError, loginError } =
    useInternetIdentity();
  const { setMobileSession } = useMobileSession();
  const navigate = useNavigate();

  // Mobile OTP state
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [otpStep, setOtpStep] = useState<"input" | "verify">("input");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (identity) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (isLoginError && loginError) {
      toast.error(loginError.message ?? "Login failed. Please try again.");
    }
  }, [isLoginError, loginError]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Enter your full name");
      return;
    }
    setOtpLoading(true);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setTimeout(() => {
      setOtpStep("verify");
      setOtpLoading(false);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      setMobileSession(phone, fullName);
      toast.success(`Welcome back! Logged in as ${fullName}.`);
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Incorrect OTP. Please try again.");
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
            <Tabs defaultValue="ii" className="w-full">
              <TabsList className="w-full mb-6 bg-muted/30">
                <TabsTrigger
                  value="ii"
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-ocid="login.tab"
                >
                  <Lock size={14} className="mr-2" />
                  Internet Identity
                </TabsTrigger>
                <TabsTrigger
                  value="mobile"
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-ocid="login.tab"
                >
                  <Phone size={14} className="mr-2" />
                  Mobile OTP
                </TabsTrigger>
              </TabsList>

              {/* Internet Identity Tab */}
              <TabsContent value="ii">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Lock size={28} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <h2 className="font-semibold text-lg mb-2">
                      Secure Authentication
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      GUCCORA uses Internet Identity for passwordless,
                      cryptographically secure authentication. No passwords. No
                      data leaks.
                    </p>
                  </div>
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ShieldCheck
                        size={16}
                        className="text-primary shrink-0"
                      />
                      <span>
                        Anonymous by default — your identity stays private
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ShieldCheck
                        size={16}
                        className="text-primary shrink-0"
                      />
                      <span>No username or password required</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ShieldCheck
                        size={16}
                        className="text-primary shrink-0"
                      />
                      <span>Secured on the Internet Computer blockchain</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full gold-gradient text-primary-foreground font-bold rounded-full py-3 text-base"
                    onClick={login}
                    disabled={isLoggingIn}
                    data-ocid="login.primary_button"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />{" "}
                        Connecting...
                      </>
                    ) : (
                      "Sign In with Internet Identity"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Mobile OTP Tab */}
              <TabsContent value="mobile">
                {otpStep === "input" ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                        <Phone size={28} className="text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Enter your mobile number to receive an OTP
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="bg-muted/30 border-border"
                        data-ocid="login.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-muted/30 border border-border rounded-md text-sm text-muted-foreground">
                          +91
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
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
                      disabled={otpLoading}
                      data-ocid="login.primary_button"
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                        <Phone size={28} className="text-primary" />
                      </div>
                    </div>

                    {/* OTP display box */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        OTP sent to{" "}
                        <span className="text-foreground font-medium">
                          +91-{phone.slice(0, 4)}XXXXXX
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
                      data-ocid="login.primary_button"
                    >
                      Verify &amp; Login
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-sm text-muted-foreground"
                      onClick={() => {
                        setOtpStep("input");
                        setEnteredOtp("");
                      }}
                      data-ocid="login.secondary_button"
                    >
                      ← Change mobile number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Register here
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
