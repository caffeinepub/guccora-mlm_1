import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
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

      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/assets/generated/guccora-logo-emblem-transparent.dim_200x200.png"
              alt=""
              className="h-6 w-6 object-contain opacity-60"
            />
            <span className="font-display gold-gradient-text text-lg tracking-widest">
              GUCCORA
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
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
      </footer>
    </div>
  );
}
