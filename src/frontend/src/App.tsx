import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminLayout } from "./components/layout/AdminLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AboutPage } from "./pages/AboutPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { PlanPage } from "./pages/PlanPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminAnnouncements } from "./pages/admin/AdminAnnouncements";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminIncomeDistribution } from "./pages/admin/AdminIncomeDistribution";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminPackages } from "./pages/admin/AdminPackages";
import { AdminTreePage } from "./pages/admin/AdminTreePage";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminWithdrawals } from "./pages/admin/AdminWithdrawals";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { IncomePage } from "./pages/dashboard/IncomePage";
import { PackagesPage } from "./pages/dashboard/PackagesPage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { ReferralsPage } from "./pages/dashboard/ReferralsPage";
import { TreePage } from "./pages/dashboard/TreePage";
import { WalletPage } from "./pages/dashboard/WalletPage";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Public layout wrapper
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

// Dashboard layout wrapper
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard",
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});

// Admin layout wrapper
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});

// Public pages
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/register",
  component: RegisterPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/about",
  component: AboutPage,
});

const planRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/plan",
  component: PlanPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/admin-login",
  component: AdminLogin,
});

// Dashboard pages
const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const treeRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/tree",
  component: TreePage,
});

const walletRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/wallet",
  component: WalletPage,
});

const incomeRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/income",
  component: IncomePage,
});

const packagesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/packages",
  component: PackagesPage,
});

const referralsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/referrals",
  component: ReferralsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/profile",
  component: ProfilePage,
});

// Admin pages
const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/users",
  component: AdminUsers,
});

const adminWithdrawalsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/withdrawals",
  component: AdminWithdrawals,
});

const adminAnnouncementsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/announcements",
  component: AdminAnnouncements,
});

const adminPackagesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/packages",
  component: AdminPackages,
});

const adminIncomeRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/income",
  component: AdminIncomeDistribution,
});

const adminTreeRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/tree",
  component: AdminTreePage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    aboutRoute,
    planRoute,
    adminLoginRoute,
  ]),
  dashboardLayoutRoute.addChildren([
    dashboardRoute,
    treeRoute,
    walletRoute,
    incomeRoute,
    packagesRoute,
    referralsRoute,
    profileRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminUsersRoute,
    adminWithdrawalsRoute,
    adminAnnouncementsRoute,
    adminPackagesRoute,
    adminIncomeRoute,
    adminTreeRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
