\# Architecture Decisions



\## Overview

Monorepo with separate backend and frontend folders.

Kept deliberately simple — clarity over complexity.



\## Backend



\### Node.js + Express + TypeScript

\- Familiar, minimal, well-suited for REST APIs

\- TypeScript gives type safety across the codebase



\### Prisma ORM + SQLite

\- Prisma gives type-safe database access and easy migrations

\- SQLite is zero-config, sufficient for this scale

\- Easy to swap to PostgreSQL via one Prisma config change



\### API structure

\- Routes → Controllers → Prisma Client

\- Business logic lives in controllers, not routes

\- Pagination handled server-side — never return all 10k rows



\### Indexes

\- Index on `country` — most common filter

\- Index on `jobTitle` — second most common filter  

\- Composite index on `(country, jobTitle)` — for combined filters



\## Frontend



\### React + TypeScript + Plain CSS

\- No CSS framework — full control over styles

\- CSS custom properties for consistent design tokens

\- Component-based architecture for reusability



\### State management

\- Local React state only — no Redux needed for this scope

\- Each page manages its own data fetching



\## Seed script performance

\- Generates all 10,000 records in memory first

\- Inserts in batches of 500 using `createMany`

\- Avoids N+1 insert problem

\- Re-runnable — clears existing data first



\## Trade-offs

\- SQLite over PostgreSQL — simpler setup, easy to swap

\- No authentication — out of scope, noted as future concern

\- No Redis caching — SQLite with indexes is fast enough

\- CRA over Vite — broader familiarity, stable tooling



\## AI tools used

\- Claude (Anthropic) — used for code generation, debugging,

&#x20; architecture guidance and step-by-step implementation support

\- All generated code was reviewed, understood and adapted

