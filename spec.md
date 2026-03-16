# GUCCORA MLM

## Current State
- Income is distributed manually by admin via /admin/income page
- `awardDirectReferralIncome`, `awardBinaryPairIncome`, `awardLevelIncome` are admin-only functions
- `registerUser` creates user and wallet but does NOT credit any income
- `purchasePackage` records a purchase but does NOT trigger income distribution
- Admin income page has forms to manually award all income types

## Requested Changes (Diff)

### Add
- Private `autoDistributeOnJoin(newUser, sponsorPrincipal)` helper in backend:
  - Credits direct referral income (10% of base unit = 100 points) to direct sponsor
  - Checks if sponsor now has both left+right children → credits binary pair income (50 points) to sponsor
  - Walks up 10 ancestor levels and credits level income (tiered: L1=5%, L2=4%, L3-10=2% of base)
- Private `autoDistributeOnPlanActivation(buyer, packagePrice)` helper:
  - Same level income walk up 10 ancestors, scaled by package price
  - Direct referral income to sponsor based on package price
- All auto-distribution uses existing `creditIncomeToWallet` internal function

### Modify
- `registerUser`: call `autoDistributeOnJoin` after successful registration
- `purchasePackage`: call `autoDistributeOnPlanActivation` after purchase
- `awardDirectReferralIncome`, `awardBinaryPairIncome`, `awardLevelIncome`: keep but rename label in frontend to "Manual Correction / Bonus"
- Admin income page: update title/description to clarify it's for corrections only, remove primary emphasis on awarding

### Remove
- Nothing removed; manual award functions kept for corrections

## Implementation Plan
1. Add auto-distribution helper functions in main.mo (private, no auth check)
2. Call auto-distribute in `registerUser` after user + wallet are created
3. Call auto-distribute in `purchasePackage` after purchase is recorded
4. Update admin income distribution page UI to label section as "Manual Correction / Bonus"
5. Add income auto-distribution status notes to user income page
