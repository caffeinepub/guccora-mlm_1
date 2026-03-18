# GUCCORA MLM

## Current State
Full MLM web app with Motoko backend, luxury black/gold UI, mobile OTP auth, user dashboard, and admin panel. Plans are named: Starter Plan (₹499), Silver Plan (₹999), Gold Plan (₹1999), Diamond Plan (₹2999). Income: direct 10%, binary 10%, 10-level income. Dashboard and admin panel fully functional.

## Requested Changes (Diff)

### Add
- Nothing new structurally

### Modify
- Rename all four plans across frontend:
  - Starter Plan → Starter Wellness Kit
  - Silver Plan → Smart Growth Kit
  - Gold Plan → Premium Success Kit
  - Diamond Plan → Royal Leader Kit
- Update plan name references in: PackagesPage, LandingPage, DashboardPage, BusinessPlanPage, PlanPage, AdminPackages, income pages
- Confirm income structure displayed clearly: Direct 10%, Binary 10%, Level income 10 levels (Level 1=10%, 2=5%, 3=4%, 4=3%, 5=2%, 6=2%, 7=1%, 8=1%, 9=1%, 10=1%)

### Remove
- Old plan names (Starter/Silver/Gold/Diamond) replaced throughout

## Implementation Plan
1. Update PLANS constant in PackagesPage.tsx with new names
2. Update plan names in LandingPage.tsx income/packages sections
3. Update BusinessPlanPage.tsx and PlanPage.tsx plan names
4. Update AdminPackages.tsx default plan names
5. Update DashboardPage.tsx active plan display
6. Update backend planId→name mapping in all frontend helpers
