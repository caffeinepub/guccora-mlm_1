# GUCCORA MLM

## Current State

Full MLM app running on Internet Computer with Motoko backend. Backend has all required functions: `registerMobileUser`, `purchaseMobileUserPlan`, `verifyMobileLogin`, `createFirstAdmin`, MLM income distribution, wallet, withdrawal, recharge, bank details, binary tree, and admin control. OTP is currently generated in-memory and shown on-screen for testing only -- no real SMS is sent.

Frontend has backend.ts with all function declarations and implementations. All major pages exist: homepage, register, login, dashboard, admin panel, wallet, income, tree, bank details.

## Requested Changes (Diff)

### Add
- Real SMS OTP delivery via MSG91 HTTP outcall from backend (http-outcalls component)
- `sendOtpToPhone(phone)` backend function using MSG91 API
- `verifyPhoneOtp(phone, otp)` backend function checking against stored OTP
- MSG91 config stored as backend variable (authKey, templateId, senderId)
- Admin can configure MSG91 credentials via admin panel
- Fallback: if MSG91 not configured, show OTP on screen (dev mode)
- Frontend registration flow updated to call `sendOtpToPhone` first, then `registerMobileUser` with verified OTP
- Frontend login flow updated to use `sendOtpToPhone` + verify before login
- SMS config section in admin panel for MSG91 key setup

### Modify
- `registerMobileUser` to accept pre-verified OTP token (or verify inline with stored OTP)
- Frontend registration and login pages to show real SMS status
- Admin panel to include SMS configuration section
- All income calculations to remain automatic as-is

### Remove
- On-screen OTP display when MSG91 is configured

## Implementation Plan

1. Select http-outcalls component
2. Regenerate backend adding:
   - MSG91 OTP send function via HTTP outcall
   - OTP verification function
   - Admin MSG91 config storage
   - All existing MLM functions preserved
3. Update frontend backend.ts declarations
4. Update RegisterPage, LoginPage, LandingPage OTP flows
5. Add SMS Config section to admin panel
6. Deploy
