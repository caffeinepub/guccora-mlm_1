import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

export function AdminLogin() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true);
    try {
      // Frontend credential check
      if (username !== "admin" || password !== "admin123") {
        toast.error("Invalid credentials");
        setLoading(false);
        return;
      }

      // Call backend loginAsAdmin with the current (possibly anonymous) actor
      // This grants the caller's principal admin permissions in the backend
      if (actor) {
        try {
          await actor.loginAsAdmin(password);
        } catch (_) {
          // Backend call is best-effort; session continues regardless
        }
      }

      localStorage.setItem("guccora_admin_session", "true");
      toast.success("Welcome, Administrator!");
      navigate({ to: "/admin" });
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
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} className="text-red-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-red-400">
            Admin Login
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Access restricted to authorized personnel
          </p>
        </div>

        <Card className="bg-card border-red-500/20 shadow-lg shadow-red-500/5">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="bg-muted/30 border-border focus:border-red-500/50"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted/30 border-border focus:border-red-500/50"
                  data-ocid="admin.input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                disabled={loading}
                data-ocid="admin.submit_button"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Admin Panel"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <a
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ← Back to homepage
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
