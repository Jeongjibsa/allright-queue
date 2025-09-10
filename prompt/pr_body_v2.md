# Summary

Refactor to consistent TypeScript + Next.js conventions with shared modules. No functional changes.

# Changes
- Shared types: `src/types/queue.ts`, `src/types/domain.ts`
- Constants: `src/lib/constants.ts` (`SERVICE_WAIT_TIMES`, `DEFAULT_SERVICE_OPTIONS`, `LS_KEYS`)
- Utilities: `src/lib/time.ts` (formatters), `src/lib/storage.ts` (typed localStorage + defaults)
- Pages/API updated to import shared modules (behavior unchanged)

# Validation
- Lint passes (warnings only)
- Prettier format applied
- Typecheck passes (`tsc --NoEmit`)
- Next build: blocked by sandbox Turbopack permissions here; expected to pass locally

# Notes
- Label: `auto-generated`
- Tag: [gen by codex]

