# GUCCORA MLM

## Current State
Full-stack MLM app on IC with Internet Identity auth, binary MLM system, user dashboard, wallet, admin panel, binary tree viewer, and public pages. All amounts display as ICP. No mobile OTP login. No admin login button in public header. Admin panel has no separate login page.

## Requested Changes (Diff)

### Add
- Mobile OTP login flow (simulated: frontend generates OTP, shows in UI, user enters it; stored in sessionStorage; after verify, creates a mobile session in localStorage)
- `useMobileSession` hook to manage mobile OTP session state (phone, name stored locally)
- `/admin-login` page: username/password form (admin / admin123 validated locally, sets adminLoggedIn flag in localStorage)
- `/admin/tree` page: visual binary MLM tree with expandable nodes, showing user ID, position, sponsor, active plan
- Admin Panel button in public header (navigates to /admin)
- Left Team Count and Right Team Count cards on user dashboard
- Direct Referral, Binary Pair, Level Income breakdown on dashboard
- Binary tree quick link on Admin Overview page
- Manage Announcements link on Admin panel

### Modify
- `formatICP` → `formatRupees`: display ₹ symbol, no ICP suffix, format as Indian rupees (e.g. ₹599)
- All pages using formatICP updated to use formatRupees
- Landing page: replace "50K ICP" stat with "₹50L+"; replace ICP references with ₹
- LoginPage: add two tabs — "Internet Identity" (existing) and "Mobile OTP" (new flow)
- PublicLayout header: add Admin Panel button linking to /admin
- AdminLayout: check localStorage for adminLoggedIn OR Internet Identity; if neither, redirect to /admin-login
- AdminLayout sidebar: add Tree View link (/admin/tree)
- DashboardPage: replace ICP values with ₹ values; add income breakdown cards (Direct, Binary, Level); add Left/Right team count
- Color coding: Dashboard cards use purple gradient; Wallet page uses green; Income page uses gold/amber; Admin panel uses red accent
- AdminDashboard: add Tree View quick-link card

### Remove
- Nothing removed; only extending existing features

## Implementation Plan
1. Update formatters.ts: rename formatICP → formatRupees, display ₹, divide by 1 (values already stored as small units)
2. Create useMobileSession.ts hook for localStorage-based mobile session
3. Update LoginPage.tsx: two tabs (II + Mobile OTP), full OTP flow
4. Create AdminLogin.tsx at /admin-login: username/password with default credentials check
5. Update AdminLayout.tsx: add session check + redirect + Tree View nav item
6. Update PublicLayout.tsx: add Admin Panel button in header
7. Create AdminTreePage.tsx: visual binary tree with mock/real data from getAllUsers
8. Update App.tsx: add /admin-login route and /admin/tree route
9. Update all dashboard pages (DashboardPage, WalletPage, IncomePage) to use formatRupees and color coding
10. Update LandingPage: replace ICP references with ₹
11. Update AdminDashboard: add Tree View quick link, use formatRupees
