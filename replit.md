# EFFF Club Dashboard

A premium role-based members portal for EFFF Club — a women-focused egg freezing and fertility planning ecosystem. Combines concierge healthcare, financial planning tools, a supportive community, and a fertility journey tracker.

## Run & Operate

- `pnpm --filter @workspace/efff-dashboard run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas

## Demo Login Credentials

| Role   | Email                  | Password    | Details                              |
|--------|------------------------|-------------|--------------------------------------|
| User   | user@efffclub.com      | password123 | Priya Sharma, Platinum, Consultation Pending |
| Doctor | doctor@efffclub.com    | password123 | Dr. Jatin Shah, OB-GYN, Colaba |
| Admin  | admin@efffclub.com     | password123 | Full admin access |

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui + Framer Motion
- Backend: Express 5 (in-memory store with rich demo data)
- API codegen: Orval (from OpenAPI spec)
- Auth: bearer token stored in localStorage, wired via `setAuthTokenGetter`

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not hand-edit)
- `artifacts/efff-dashboard/src/` — frontend app
- `artifacts/efff-dashboard/src/contexts/AuthContext.tsx` — auth state + localStorage persistence
- `artifacts/efff-dashboard/src/pages/` — all pages organized by role (user/, doctor/, admin/)
- `artifacts/api-server/src/store/index.ts` — in-memory demo data store
- `artifacts/api-server/src/routes/` — API route handlers per domain

## Architecture decisions

- **In-memory store**: Phase 1 uses in-memory storage with rich seeded demo data. Future: swap store for Drizzle + PostgreSQL without changing route contracts.
- **Token auth**: Frontend uses `setAuthTokenGetter` from `@workspace/api-client-react` so all generated hooks automatically attach the bearer token without manual fetch wiring.
- **Role-based routing**: After login, the router redirects to `/user/dashboard`, `/doctor/dashboard`, or `/admin/dashboard` based on the user's `role` field. Each role has completely isolated navigation.
- **OpenAPI-first**: All API contracts defined in `lib/api-spec/openapi.yaml` before implementation. Generated hooks consumed directly by the design subagent.

## Membership Plans

| Plan       | Price         | Platform Fee | Seminar Discount |
|------------|---------------|--------------|------------------|
| Basic      | Free          | 7%           | 20%              |
| Gold       | ₹999/month    | 3.5%         | 40%              |
| Platinum   | ₹4999/month   | 2.5%         | 50%              |
| FemmeElite | ₹9999/month   | 1.5%         | 60%              |

## User preferences

_Populate as needed_

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before modifying route handlers or frontend hooks.
- The `setAuthTokenGetter` call in `main.tsx` must run before any React Query hook fires — it's set at module init time.
- The `font-display` utility in Tailwind is wired via `--font-display` in `@theme inline` in `index.css` — use `className="font-display"` for headings.
- CSS custom colors not in Tailwind defaults (e.g. `plum`) must be added to `@theme inline` in `index.css` first, or use an equivalent default color.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
