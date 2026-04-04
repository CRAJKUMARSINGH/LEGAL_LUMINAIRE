# Legal Luminaire

## Overview

A professional legal case management system for construction contract disputes in India. Built on a pnpm workspace monorepo with TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/legal-luminaire) — main app at `/`
- **API framework**: Express 5 (artifacts/api-server) — served at `/api`
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Application Features

- **Case Management**: Track legal cases (construction contracts, show cause notices, breach of contract, payment claims) with full CRUD
- **Notice Management**: Log incoming/outgoing legal notices with type, clause references, response deadlines
- **Draft Reply System**: Compose and manage formal legal letter drafts (reply to show cause, counter notice, time extension request, etc.)
- **Correspondence Timeline**: Chronological view of all correspondence for each case
- **Bill Tracking**: Manage bills/payment claims in Indian Rupees with GST, track pending/overdue/disputed amounts
- **Parties Management**: Maintain parties (trusts, contractors, government bodies)
- **Dashboard**: Stats overview, recent activity, pending bills breakdown

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/legal-luminaire run dev` — run frontend locally

## Current Case Data

The database is seeded with the Pitambara Peeth vs Roopam Construction case including:
- Show Cause Notice No. 337 dated 02.04.2026
- Full correspondence timeline
- Bills totalling ₹32,85,000 pending
- Finalized draft reply to the show cause notice

## DB Schema

- `parties` — clients, contractors, trusts, government bodies
- `cases` — legal cases with contract details
- `notices` — legal notices with type, clause references, response deadlines
- `drafts` — draft legal reply letters
- `correspondence` — incoming/outgoing correspondence log
- `bills` — bills and payment claims with Indian Rupee amounts

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
