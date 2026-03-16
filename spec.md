# GUCCORA MLM

## Current State
- Full binary MLM backend with User, Wallet, Transaction, WithdrawalRequest types
- TransactionType has: binaryCommission, directReferralBonus, rankBonus, withdrawal, adjustment
- Wallet tracks totalEarnings, availableBalance, pendingBalance, withdrawnAmount
- Withdrawal request system exists (requestWithdrawal, processWithdrawalRequest)
- Frontend has WalletPage, AdminWithdrawals, DashboardPage
- No income awarding functions exist (admin cannot credit income to users)
- No level income (10-level) transaction type
- No income stats breakdown API
- No dedicated income history page in dashboard

## Requested Changes (Diff)

### Add
- Backend: `#levelIncome` variant to TransactionType
- Backend: `creditIncomeToWallet` internal helper to update wallet + create transaction atomically
- Backend: `awardDirectReferralIncome(toUser, amount, fromUser)` - admin awards direct referral income
- Backend: `awardBinaryPairIncome(toUser, amount)` - admin awards binary pair matching income
- Backend: `awardLevelIncome(toUser, amount, level, fromUser)` - admin awards level income (levels 1-10)
- Backend: `getIncomeStats(userId)` - returns per-type income totals for a user
- Backend: `getMyIncomeStats()` - caller's income breakdown (user-callable)
- Frontend: `IncomePage` at `/income` — shows income breakdown cards + income history table filtered by type
- Frontend: `AdminIncomeDistribution` page at `/admin/income` — forms to award direct referral, binary pair, and level income to any user
- Frontend: Add `/income` route to dashboard layout and `/admin/income` to admin layout
- Frontend: `useIncomeStats` query hook
- Frontend: `useAwardIncome` mutation hooks
- Frontend: Add `levelIncome` label to formatters
- Frontend: Update DashboardPage income breakdown cards (direct, binary, level totals)

### Modify
- Backend: `addTransaction` to also update wallet `availableBalance` and `totalEarnings` when adding income transactions
- Frontend: WalletPage — add income stats summary section above transaction history
- Frontend: DashboardLayout nav — add "Income" link

### Remove
- Nothing removed

## Implementation Plan
1. Update backend main.mo: add `#levelIncome` tx type, `creditIncomeToWallet` helper, `awardDirectReferralIncome`, `awardBinaryPairIncome`, `awardLevelIncome`, `getIncomeStats`, `getMyIncomeStats`
2. Update backend `addTransaction` to credit wallet balance when tx type is income-type
3. Regenerate frontend bindings via generate_motoko_code
4. Add `useIncomeStats`, `useAwardDirectReferral`, `useAwardBinaryPair`, `useAwardLevelIncome` to useQueries.ts
5. Add `levelIncome` to formatters.ts txTypeLabel
6. Create `IncomePage` at `/income` with income type breakdown + history
7. Create `AdminIncomeDistribution` page at `/admin/income`
8. Add routes to App.tsx
9. Add nav link in DashboardLayout
