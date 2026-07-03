# Snapester (comet)

A client-side tool that turns plain screenshots into polished, share-worthy visuals — add backgrounds, window frames, shadows, and rounded corners, then export as PNG or copy to clipboard.

## Run & Operate

- `pnpm --filter @workspace/snapester run dev` — run the frontend (via the "web" workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- No database or API routes are used by this app currently.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React, wouter (routing), Tailwind v4, shadcn/ui
- API server and DB scaffolding exist (`artifacts/api-server`, `lib/db`) but are unused — the app is fully client-side.

## Where things live

- `artifacts/snapester/src/App.tsx` — Landing page, Editor page/logic, and routing all live in this single file (ported as-is from the imported project).
- `artifacts/snapester/src/components/ui/` — shadcn/ui components.
- `artifacts/snapester/public/` — mockup/OG images and favicon.

## Architecture decisions

- Migrated from a Vercel/v0 export that was already a Vite + React app (not Next.js) — no framework conversion was needed, just restructuring into the `pnpm_workspace` artifact layout.
- The landing page's "Try it now" preview and fullscreen overlay both embed the `/editor` route via `<iframe>` rather than rendering the editor component inline.

## Product

- Landing page describing the product, with an embedded live preview of the editor and a pricing section.
- `/editor` — drag-and-drop screenshot editor: background gradients/solids, padding, rounded corners, window frame chrome (macOS/Browser/Arc/Terminal/iPhone/Android), drop shadow, and export (download PNG / copy to clipboard).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Automated tests that click controls inside the landing page's fullscreen editor overlay can fail due to Playwright's nested-iframe pointer interception (the overlay embeds `/editor` in an iframe). Test editor interactions directly at the `/editor` route instead.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
