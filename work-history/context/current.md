# Current Context (Single Source of Truth)

> This file is the **single source of truth** for “what we’re doing now”.
> Keep it updated whenever you start/stop/resume work.
>
> Replaces older/branch-specific status docs (e.g. `work-history/current-features.md`).

## Meta
- **Last updated**: 2026-01-19
- **Baseline branch**: develop
- **Owner**: (fill)

## Current Goal
- (fill) What are we trying to ship next?

## Status
- **In progress**: none
- **Blocked**: 
  - External Adapters (#11) blocked until SSO integration is complete
- **Waiting for decision**:
  - (fill)

## Current Decisions (locked)
- Response ends when organizer confirms (manual confirm).
- (fill other decisions if needed)

## What’s Done (recent)
- PR #18 merged: UI common guideline + MUI theme token cleanup.
- PR #19 merged: boilerplate starter template.

## Known Issues / Tech Debt
- Web tests have stderr warnings (React act + invalid <p><div> nesting) but currently pass.
- `apps/web` test script runs vitest in watch mode; use `vitest --run` for CI-like execution.

## How to Verify Locally (develop)
```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
node -v
pnpm -v
pnpm install
pnpm --filter api run db:migrate:dev
pnpm --filter api run build
pnpm --filter web run build
pnpm --filter web exec vitest --run
```

## Links
- Issue #6 (decisions/blockers): https://github.com/Crong-Gabia/BookingTime/issues/6
- Issue #11 (External Adapters): https://github.com/Crong-Gabia/BookingTime/issues/11
