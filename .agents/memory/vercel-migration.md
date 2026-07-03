---
name: Vercel/v0 migration nuances
description: Notes on porting Vercel/v0 imports into the pnpm_workspace stack
---

Not all Vercel/v0 exports are Next.js. Some are already Vite + React (with
`@replit/vite-plugin-*` deps, `vite.config.ts`, wouter routing already in
place) — in that case the "migration" is really just a copy into the new
artifact layout via `fullstack_copy_frontend.sh`, no Next.js→Vite conversion
work needed.

**Why:** Assuming Next.js and starting a routing/data-fetching conversion
wastes time when the export is already framework-compatible. Always run the
detect script and read the actual `package.json`/`vite.config.ts` in
`.migration-backup` before planning conversion work.

**How to apply:** If `.migration-backup` already has a `vite.config.ts`,
`index.html` at the app root, and no `next` dependency, treat it as a
Vite app port, not a Next.js conversion. Still restructure into the
`artifacts/<slug>` layout via `createArtifact` + `fullstack_copy_frontend.sh`.

`fullstack_copy_frontend.sh <slug> --client-dir <path>` expects `--client-dir`
**relative to `.migration-backup/`**, not relative to the repo root — passing
a path that already includes `.migration-backup/` doubles the prefix and
silently no-ops (prints a WARNING instead of erroring loudly).
