import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useRouterState } from "@tanstack/react-router";
import { Globe, Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useMobileSession } from "../../hooks/useMobileSession";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { mobileSession } = useMobileSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLoggedIn = !!identity || !!mobileSession?.isLoggedIn;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/plan", label: "Comp Plan" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 glass-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-3"
              data-ocid="nav.link"
            >
              <img
                src="/assets/generated/guccora-logo-emblem-transparent.dim_200x200.png"
                alt="GUCCORA"
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-xl font-bold gold-gradient-text tracking-widest">
                GUCCORA
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-body font-medium transition-colors hover:text-primary ${
                    currentPath === link.to
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button
                    variant="default"
                    className="bg-primary text-primary-foreground hover:opacity-90"
                    data-ocid="nav.primary_button"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                      data-ocid="nav.secondary_button"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      className="gold-gradient text-primary-foreground font-semibold"
                      data-ocid="nav.primary_button"
                    >
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm"
                  data-ocid="nav.secondary_button"
                >
                  Admin Panel
                </Button>
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button
                    className="w-full gold-gradient"
                    data-ocid="nav.primary_button"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full"
                      data-ocid="nav.secondary_button"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button
                      className="w-full gold-gradient"
                      data-ocid="nav.primary_button"
                    >
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/admin" onClick={() => setMobileOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  data-ocid="nav.secondary_button"
                >
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Rich 3-column footer */}
      <footer className="border-t border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/guccora-logo-emblem-transparent.dim_200x200.png"
                  alt=""
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display text-2xl font-bold gold-gradient-text tracking-widest">
                  GUCCORA
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The premium binary MLM platform built for ambitious
                entrepreneurs worldwide. Build your network, build your legacy.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={14} className="text-primary shrink-0" />
                  <span>support@guccora.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={14} className="text-primary shrink-0" />
                  <span>+91-9000000000</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe size={14} className="text-primary shrink-0" />
                  <span>GUCCORA Network, India</span>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-foreground tracking-wide">
                Quick Links
              </h4>
              <nav className="space-y-2.5">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/plan", label: "Compensation Plan" },
                  { to: "/register", label: "Register" },
                  { to: "/login", label: "Login" },
                  { to: "/admin", label: "Admin Panel" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3: Join Us */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-foreground tracking-wide">
                Join Us
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Start your GUCCORA journey today. Register for free and begin
                building your binary network to earn real income.
              </p>
              <Link to="/register">
                <Button
                  className="gold-gradient text-primary-foreground font-semibold w-full sm:w-auto"
                  data-ocid="footer.primary_button"
                >
                  Register Now
                </Button>
              </Link>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="mailto:support@guccora.com"
                  className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Email"
                >
                  <Mail size={15} />
                </a>
                <a
                  href="tel:+919000000000"
                  className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Phone"
                >
                  <Phone size={15} />
                </a>
                <a
                  href="https://guccora.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Website"
                >
                  <Globe size={15} />
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-border/50" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} GUCCORA Network. All rights
              reserved.
            </p>
            <p>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
