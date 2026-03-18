import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useMobileSession } from "../../hooks/useMobileSession";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { mobileSession } = useMobileSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLoggedIn = !!identity || !!mobileSession?.isLoggedIn;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products" },
    { to: "/business-plan", label: "Business Plan" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0a0a0a" }}
    >
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0.80)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(212,175,55,0.3)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
              data-ocid="nav.link"
            >
              <Crown size={22} style={{ color: "#D4AF37" }} />
              <span
                className="font-display text-xl font-bold tracking-widest"
                style={{
                  background:
                    "linear-gradient(135deg, #D4AF37, #FFD700 50%, #B8960C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                GUCCORA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium transition-all duration-200"
                  style={{
                    color:
                      currentPath === link.to
                        ? "#D4AF37"
                        : "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                  }}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard" data-ocid="nav.primary_button">
                  <button
                    type="button"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                      color: "#0a0a0a",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "24px",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/login" data-ocid="nav.secondary_button">
                    <button
                      type="button"
                      style={{
                        background: "transparent",
                        color: "#D4AF37",
                        border: "1px solid #D4AF37",
                        padding: "7px 18px",
                        borderRadius: "24px",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.background =
                          "rgba(212,175,55,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.background =
                          "transparent";
                      }}
                    >
                      Login
                    </button>
                  </Link>
                  <Link to="/register" data-ocid="nav.primary_button">
                    <button
                      type="button"
                      style={{
                        background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                        color: "#0a0a0a",
                        border: "none",
                        padding: "8px 20px",
                        borderRadius: "24px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Register
                    </button>
                  </Link>
                </>
              )}
              <Link to="/admin" data-ocid="nav.link">
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    color: "rgba(255,80,80,0.8)",
                    border: "1px solid rgba(255,80,80,0.3)",
                    padding: "7px 14px",
                    borderRadius: "24px",
                    fontWeight: 500,
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Admin
                </button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="md:hidden p-2"
              style={{
                color: "#D4AF37",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              background: "rgba(10,10,10,0.98)",
              borderTop: "1px solid rgba(212,175,55,0.2)",
            }}
            className="md:hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2 text-sm font-medium transition-colors"
                  style={{
                    color:
                      currentPath === link.to
                        ? "#D4AF37"
                        : "rgba(255,255,255,0.75)",
                  }}
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              <div
                className="flex gap-3 pt-3 border-t"
                style={{ borderColor: "rgba(212,175,55,0.15)" }}
              >
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                        color: "#0a0a0a",
                        border: "none",
                        padding: "10px",
                        borderRadius: "24px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      <button
                        type="button"
                        style={{
                          width: "100%",
                          background: "transparent",
                          color: "#D4AF37",
                          border: "1px solid #D4AF37",
                          padding: "10px",
                          borderRadius: "24px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Login
                      </button>
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      <button
                        type="button"
                        style={{
                          width: "100%",
                          background:
                            "linear-gradient(135deg, #D4AF37, #FFD700)",
                          color: "#0a0a0a",
                          border: "none",
                          padding: "10px",
                          borderRadius: "24px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Register
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        style={{
          background: "#070707",
          borderTop: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Crown size={20} style={{ color: "#D4AF37" }} />
                <span
                  className="font-display text-xl font-bold tracking-widest"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  GUCCORA
                </span>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  maxWidth: "300px",
                }}
              >
                Build Wealth. Build Legacy. Join thousands of successful members
                in GUCCORA's premium network marketing system.
              </p>
            </div>
            <div>
              <h4
                className="font-display font-semibold mb-4"
                style={{ color: "#D4AF37" }}
              >
                Quick Links
              </h4>
              <div className="space-y-2">
                {["/", "/about", "/products", "/business-plan", "/contact"].map(
                  (href, i) => (
                    <Link
                      key={href}
                      to={href}
                      className="block text-sm transition-colors hover:text-primary"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {
                        [
                          "Home",
                          "About",
                          "Products",
                          "Business Plan",
                          "Contact",
                        ][i]
                      }
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4
                className="font-display font-semibold mb-4"
                style={{ color: "#D4AF37" }}
              >
                Contact
              </h4>
              <div
                className="space-y-2"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
              >
                <p>support@guccora.com</p>
                <p>+91 98765 43210</p>
                <p>Mumbai, India</p>
                <div className="flex gap-3 pt-2">
                  <Link to="/login">
                    <span
                      style={{
                        color: "rgba(212,175,55,0.7)",
                        fontSize: "13px",
                      }}
                    >
                      Login
                    </span>
                  </Link>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                  <Link to="/register">
                    <span
                      style={{
                        color: "rgba(212,175,55,0.7)",
                        fontSize: "13px",
                      }}
                    >
                      Register
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
            style={{
              borderTop: "1px solid rgba(212,175,55,0.1)",
              color: "rgba(255,255,255,0.35)",
              fontSize: "13px",
            }}
          >
            <p>© {new Date().getFullYear()} GUCCORA. All Rights Reserved.</p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
