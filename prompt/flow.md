# Automation Flow & Rules

This document defines the standard automated flow for code changes and PRs. It targets consistency and repeatability for this repository.

## Preconditions
- Work on the `v2` branch until it is merged. Create feature branches off `v2` if needed.
- English-only for all documentation and PR descriptions.
- Branch names: English, kebab-case, with prefixes `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `perf/`, `test/`.
  - Examples: `feat/queue-progress-bar`, `fix/admin-refresh`, `docs/update-prd`.

## Lint, Typecheck, Build
- Lint: `pnpm lint` (fix errors; warnings allowed unless they hide issues).
- Format: `pnpm format` (must be clean before commit).
- Typecheck: `pnpm -s tsc --noEmit` (must pass).
- Build (optional in sandbox): `pnpm build` or smoke `pnpm dev` locally if Turbopack is blocked.

## Commit & Push
- Conventional commit style; include scope when relevant.
- Append `[gen by codex]` to messages created by automation.
- Example: `refactor(v2): standardize TS/Next.js conventions [gen by codex]`.
- Push to remote (feature branch or `v2`).

## Pull Request
- Base: `main`. Head: `v2` (or your `feat/*` branched from `v2`).
- Title example: `refactor(v2): TS/Next.js conventions, shared types/constants/helpers [gen by codex]`.
- Body should summarize problem, solution, validations; screenshots for UI.
- Label: add `gen by codex`. If labels are unavailable, include `[gen by codex]` in the title.
- Command:
  - `gh pr create --base main --head v2 --title "<TITLE>" --body "<BODY>" --label "gen by codex"`
  - Requires `gh auth login` or `GH_TOKEN`.

## Safety
- No destructive operations (deletes, resets) without explicit request.
- Keep changes scoped; avoid renaming public routes or API paths unless required.
- Update docs when adding/moving files.

## Rollback
- If issues arise, revert the commit on `v2` and open a follow-up PR with fix and clear description.

