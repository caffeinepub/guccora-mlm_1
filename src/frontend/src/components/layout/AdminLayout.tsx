import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Megaphone,
  Menu,
  Network,
  Package,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const adminNavItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: CreditCard },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/income", label: "Income Distribution", icon: DollarSign },
  { to: "/admin/tree", label: "Tree View", icon: Network },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

  const hasAdminSession =
    localStorage.getItem("guccora_admin_session") === "true";

  useEffect(() => {
    if (!hasAdminSession) {
      navigate({ to: "/admin-login" });
    }
  }, [hasAdminSession, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("guccora_admin_session");
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
          <div>
            <div className="font-display text-base font-bold gold-gradient-text tracking-widest">
              GUCCORA
            </div>
            <div className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold inline-block mt-0.5">
              ADMIN
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 mb-4"
          data-ocid="nav.link"
        >
          <LayoutGrid size={18} />
          Member Dashboard
        </Link>
        <div className="text-xs text-muted-foreground uppercase tracking-wider px-3 pb-2">
          Admin
        </div>
        {adminNavItems.map(({ to, label, icon: Icon }) => {
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
              className="absolute top-4 right-4 text-muted-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="sticky top-0 z-30 glass-surface border-b border-red-500/20 px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h1 className="text-sm font-semibold text-red-400 tracking-wide">
            Administration Panel
          </h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
