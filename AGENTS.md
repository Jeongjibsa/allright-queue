# Repository Guidelines

## Project Structure & Module Organization

- Source lives in `src/`.
  - `src/app/` — Next.js App Router (pages, layouts, API under `api/`).
  - `src/components/ui/` — shared UI components (shadcn/Radix-based).
  - `src/lib/` — hooks and utilities (e.g., `useQueue.ts`, `utils.ts`).
  - `public/` — static assets.
- Avoid creating new top-level folders without discussion.

## Build, Test, and Development Commands

- `pnpm dev` — run local dev server (Turbopack) at `http://localhost:3000`.
- `pnpm build` — production build.
- `pnpm start` — start production server.
- `pnpm lint` — run ESLint checks.
- `pnpm format` — format with Prettier.
- `pnpm add-component` — add shadcn/ui components.

## Coding Style & Naming Conventions

- Language: TypeScript + React (Next.js 15, App Router).
- Formatting: Prettier (2-space indent, 100 char width); run `pnpm format` before PRs.
- Linting: ESLint with `next/core-web-vitals` and TanStack Query rules; fix warnings where feasible.
- Components: file names lowercase (e.g., `button.tsx`), exported component identifiers in PascalCase.
- Hooks: `useX` naming in `src/lib/` (e.g., `useReservation.ts`).
- Styles: Tailwind CSS 4 utilities; prefer co-locating classNames in components and `cn`/merge helpers.
- Documentation: Write all docs (README, PRD, ADRs, comments in `.md` files) in English only.

## Testing Guidelines

- No test runner is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Place tests alongside sources as `*.test.ts(x)` and keep them unit-focused.
- For data-fetching logic, mock network layers and assert query states.

## Commit & Pull Request Guidelines

- Commit style: be descriptive; Conventional Commits encouraged (e.g., `feat: add queue progress`, `fix: debounce input`).
- Branch naming: English only, kebab-case, with prefixes `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `perf/`, `test/` (e.g., `feat/queue-progress-bar`, `fix/admin-refresh`). Avoid non-ASCII, spaces, and underscores.
- Scope small, logically grouped changes; run `pnpm lint && pnpm format` before committing.
- PRs must include: problem statement, summary of changes, screenshots/GIFs for UI, and any follow-ups.
- Auto-generated PRs: add label `gen by codex` (and include `[gen by codex]` in the title if labels are unavailable).
- Link related issues and note breaking changes in the description.

## Security & Configuration Tips

- Do not commit secrets. Use `.env.local` for local variables (e.g., `NEXT_PUBLIC_APP_URL`).
- Keep server logic in `src/app/api/*` routes; avoid leaking server-only values to client components.
- When adding dependencies, prefer permissive licenses and update `DEPENDENCIES.md` if needed.

## Agent-Specific Instructions

- Keep changes minimal and aligned with existing structure and naming.
- Update documentation when adding or moving files.
- Avoid renaming public routes or API paths without prior agreement.
