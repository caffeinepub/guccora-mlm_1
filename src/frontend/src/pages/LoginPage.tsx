import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, identity, isLoggingIn, isLoginError, loginError } =
    useInternetIdentity();
  const navigate = useNavigate();

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
            Sign in with Internet Identity to access your dashboard
          </p>
        </div>

        <Card className="bg-card border-border card-glow">
          <CardContent className="p-8">
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
                  cryptographically secure authentication. No passwords. No data
                  leaks.
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary shrink-0" />
                  <span>
                    Anonymous by default — your identity stays private
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary shrink-0" />
                  <span>No username or password required</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary shrink-0" />
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

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
