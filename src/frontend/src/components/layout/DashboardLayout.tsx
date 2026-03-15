import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Shield,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin, useMyProfile, useMyWallet } from "../../hooks/useQueries";
import { formatICP } from "../../lib/formatters";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tree", label: "My Tree", icon: GitBranch },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/packages", label: "Packages", icon: Package },
  { to: "/referrals", label: "Referrals", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { clear } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: wallet } = useMyWallet();
  const { data: isAdmin } = useIsAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    clear();
    navigate({ to: "/" });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/guccora-logo-emblem-transparent.dim_200x200.png"
            alt="GUCCORA"
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-lg font-bold gold-gradient-text tracking-widest">
            GUCCORA
          </span>
        </Link>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <div className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
            {profile?.username?.slice(0, 2).toUpperCase() ?? "??"}
          </div>
          <div className="flex-1 min-w-0">
            {profileLoading ? (
              <Skeleton className="h-4 w-24 mb-1" />
            ) : (
              <p className="text-sm font-semibold truncate">
                {profile?.fullName ?? "Loading..."}
              </p>
            )}
            <p className="text-xs text-primary font-medium">
              {wallet ? formatICP(wallet.availableBalance) : "0.00 ICP"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = currentPath === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "sidebar-item-active"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              data-ocid="nav.link"
            >
              <Icon size={18} />
              {label}
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-primary" />
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 mt-4 border-t border-border pt-4"
            data-ocid="nav.link"
          >
            <Shield size={18} className="text-primary" />
            Admin Panel
            <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">
              ADMIN
            </span>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          data-ocid="nav.button"
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-border fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={() => setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <aside className="relative w-64 bg-sidebar border-r border-border z-10">
            <button
              type="button"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 glass-surface border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="flex-1 lg:flex-initial" />
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-semibold text-primary">
                {wallet ? formatICP(wallet.availableBalance) : "—"}
              </span>
            </div>
            <div className="h-8 w-8 rounded-full gold-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
              {profile?.username?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="border-t border-border py-4 px-6 text-center">
          <p className="text-muted-foreground text-xs">
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
        </footer>
      </div>
    </div>
  );
}
