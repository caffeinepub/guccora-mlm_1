# GUCCORA MLM App

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Complete binary MLM web application for GUCCORA brand
- Public landing page with hero section, features, compensation plan overview, and CTA
- User registration with sponsor/referral code system
- User login page
- Member dashboard: personal stats, rank, binary tree visualization (left/right legs), recent activity
- Wallet system: balance display, deposit history, withdrawal requests, transaction history
- Genealogy/downline viewer: interactive binary tree showing left and right legs up to N levels deep
- Referral link generator and sharing tools
- Admin panel: user management, withdrawal approvals, commission oversight, global stats
- Role-based access: Member and Admin roles
- Premium gold (#C9A84C) and dark purple (#1A0533) brand theme

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` component for role-based access (Member/Admin)
2. Generate Motoko backend with:
   - User profile management with sponsor tracking
   - Binary tree placement logic (left/right leg auto-placement and manual)
   - Commission calculation on binary matching volume
   - Wallet ledger: deposits, withdrawals, pending/approved states
   - Rank system based on downline volume
   - Admin functions: approve withdrawals, view all users, adjust balances
3. Build frontend:
   - Public: Landing page, About, Compensation Plan, Login, Register
   - Member: Dashboard, My Tree, Wallet, Referrals, Profile
   - Admin: Dashboard, Users, Withdrawals, Commissions, Settings
   - Shared: Navbar, Sidebar, gold/dark-purple design system
