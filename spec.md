# GUCCORA MLM

## Current State

All backend state (`users`, `wallets`, `transactions`, `withdrawalRequests`, `packages`, `announcements`, `accessControlState`) is stored in non-stable `let` variables. There are no `stable var` declarations and no `preupgrade`/`postupgrade` upgrade hooks. Every Caffeine deployment (canister upgrade) wipes all in-memory state, causing:

- Registered users vanish after each deploy
- Admin's `#admin` role in `accessControlState.userRoles` is lost
- `getAllUsers()` throws "Unauthorized" (caller no longer recognized as admin)
- Admin → Manage Users page shows "No users found"

## Requested Changes (Diff)

### Add
- `stable var` declarations for all critical state (users, wallets, transactions, withdrawal requests, packages, announcements, counters)
- `system func preupgrade()` to serialize Maps and counters into stable arrays before each upgrade
- `system func postupgrade()` to deserialize stable arrays back into Maps and re-grant access control roles after each upgrade

### Modify
- `accessControlState` role restoration in `postupgrade`: scan restored users and re-grant `#admin` to the ADMIN001 holder and `#user` to all others

### Remove
- Nothing removed

## Implementation Plan

1. Add `stable var` arrays inside the actor for each mutable Map and for the numeric counters.
2. Add `system func preupgrade()` that calls `.toArray()` on each Map and writes to stable vars.
3. Add `system func postupgrade()` that iterates each stable array, inserts entries back into the Maps, and restores `accessControlState` roles from the users data.
4. No UI changes.
