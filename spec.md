# GUCCORA MLM

## Current State
- Homepage has a registration card ("Start Your GUCCORA Journey") with Send OTP button but OTP display and inline verification flow are incomplete.
- Admin login at `/admin-login` uses username/password but hardcoded credential is `admin123`.
- No bank details section exists in the user dashboard.
- Withdrawal requests do not show bank details to admin.

## Requested Changes (Diff)

### Add
- BankDetails type in backend: AccountHolderName, BankName, AccountNumber, IFSCCode, UPIID, BranchName
- Backend functions: `saveBankDetails(phone, details)`, `getBankDetails(phone)`, `getBankDetailsByUserId(userId)` (admin)
- Stable store `_bankDetailsStable` for persistence
- `BankDetailsPage.tsx` in user dashboard with save/edit form
- Route `/dashboard/bank-details` wired in App.tsx and DashboardLayout sidebar

### Modify
- `LandingPage.tsx` homepage registration section: after Send OTP generates OTP, display the 6-digit OTP visibly on screen (testing mode), show OTP input field inline, and add "Verify & Create Account" button — all within the homepage card.
- `AdminLogin.tsx`: update hardcoded password check to accept `Admin@123` (also keep `admin123` for backward compat), update display of default credentials.
- `_adminPassword` stable var in backend default changed to `Admin@123`.
- `AdminWithdrawals.tsx`: when rendering a withdrawal request row/detail, fetch and display the user's bank details.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `src/backend/main.mo`: add BankDetails type, stable map, `saveBankDetails`, `getBankDetails`, `getBankDetailsByPhone` (admin) functions; update `_adminPassword` default to `Admin@123`.
2. Update `src/frontend/src/pages/LandingPage.tsx`: show generated OTP on-screen after Send OTP click; render OTP input and verify button inline.
3. Update `src/frontend/src/pages/admin/AdminLogin.tsx`: accept `Admin@123` as valid password.
4. Create `src/frontend/src/pages/dashboard/BankDetailsPage.tsx`: form with all 6 fields, save/edit flow using backend.
5. Update `src/frontend/src/App.tsx`: add `/dashboard/bank-details` route.
6. Update `src/frontend/src/components/layout/DashboardLayout.tsx`: add Bank Details nav link.
7. Update `src/frontend/src/pages/admin/AdminWithdrawals.tsx`: show bank details per user.
