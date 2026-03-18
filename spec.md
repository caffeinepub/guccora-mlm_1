# GUCCORA MLM

## Current State
- IC Motoko backend with stable variable storage
- Admin login page at /admin-login, accepts admin/Admin@123 or admin/admin123
- Backend default password is "Admin@123" in stable var
- AdminDashboard has connection/retry logic but sometimes shows "Backend unavailable"
- Mobile OTP registration stores users in IC backend
- Full admin panel: Users, Withdrawals, Packages, Products, Income, Tree
- Sessions stored in localStorage (guccora_admin_session, guccora_mobile_session)

## Requested Changes (Diff)

### Add
- Default admin credentials: username: admin, password: admin123 (shown as default in UI)
- Robust admin session management with proper auth guard on all admin routes
- User login page that works with stored mobile users

### Modify
- Backend default _adminPassword from "Admin@123" to "admin123"
- AdminLogin: show admin/admin123 as default credentials, accept both admin123 and Admin@123
- AdminDashboard: remove backend connectivity gating -- show admin panel immediately if localStorage session exists; load stats async without blocking UI
- AdminLayout: add proper auth guard redirect to /admin-login if no session
- DashboardLayout: add auth guard redirect to /login if no mobile session
- LoginPage: wire up mobile OTP login properly using backend sendOtpToPhone/verifyPhoneOtp/getMobileUserByPhone

### Remove
- "Backend unavailable" blocking state from admin dashboard (non-blocking: show panel with loading states)
- Dependency on IC identity for admin access (use localStorage session + password verification)

## Implementation Plan
1. Update backend main.mo: change _adminPassword default to "admin123"
2. Update AdminLogin: show admin/admin123 hint, accept both passwords
3. Update AdminDashboard: non-blocking stats load, show dashboard immediately on valid session
4. Update AdminLayout: redirect to /admin-login if no guccora_admin_session in localStorage
5. Update DashboardLayout: redirect to /login if no guccora_mobile_session
6. Update LoginPage: proper OTP-based mobile login flow
7. Validate and build
