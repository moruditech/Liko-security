# Liko Security Training — Frontend

Public website and admin panel for Liko Security Training, a PSIRA-accredited security training provider based in Mount Frere, South Africa. Built with Next.js 14 (App Router) and TypeScript, against `Liko_Frontend_TAD.md`, `DESIGN.md`, and the live backend source.

![Next.js](https://img.shields.io/badge/Next.js-14-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![Tests](https://img.shields.io/badge/tests-Vitest%20%2B%20Playwright-6e9f18)
![License](https://img.shields.io/badge/license-Proprietary-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Fonts](#fonts)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Design System](#design-system)
- [How This Was Verified](#how-this-was-verified)
- [Known Gaps and Deliberate Deviations](#known-gaps-and-deliberate-deviations)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)
- [Maintainers](#maintainers)

---

## Overview

This repository contains the complete customer-facing website (course listings, online application, gallery, contact) and the internal admin panel (applications pipeline, invoicing, content management, staff/role administration) for Liko Security Training. It consumes a separate Express/MongoDB backend (`liko-backend`) over a versioned REST API.

The build targets two distinct audiences with different constraints:

- **Public site visitors**: primarily mobile users on 3G/4G connections and budget Android devices in Mount Frere, South Africa, where load speed measurably outperforms visual complexity on user-satisfaction metrics.
- **Admin staff**: a small internal team (Super Admin, Registrar, Finance, Content Editor) managing applications, courses, and content through a permission-gated panel.

## Features

**Public site**
- PSIRA-accredited course listings with live fee data and upcoming intakes
- Interactive fee calculator (shared logic between the homepage and the application form)
- Online application flow with client-side ID validation, file upload pre-checks, and POPIA consent
- Gallery with category filtering (reflected in the URL for shareability and SEO)
- Contact form, testimonials, FAQs, and site-wide announcements

**Admin panel**
- Applications pipeline with a permission-gated status workflow (`new` → `under_review` → `payment_verified` → `enrolled`, or `rejected` from any non-terminal state)
- Invoice viewing and resending, tied to specific applications
- Course, intake, gallery, testimonial, FAQ, and announcement management
- Inquiry inbox with reply threading
- Staff user and role/permission administration
- Read-only audit log

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript, strict mode |
| Styling | CSS Modules + CSS custom properties (no Tailwind, no CSS-in-JS) |
| Data fetching | Native `fetch` via a single custom client (no SWR, no React Query) |
| State | React Context (no Redux, no Zustand) |
| Unit testing | Vitest |
| E2E testing | Playwright |
| Linting | ESLint, Stylelint |

## Architecture

- **Public routes** (`app/(public)/*`): statically generated with incremental revalidation, except `/apply`, which is server-rendered for its initial course/intake data.
- **Admin routes** (`app/admin/*`): client-rendered. This is a deliberate consequence of the auth model, not a style choice, the access token lives in memory only (never `localStorage`/`sessionStorage`), so only a client component can attach it to a request. See `lib/auth/AuthProvider.tsx`.
- **Auth**: httpOnly refresh cookie (set by the backend) plus an in-memory access token, with automatic single-flight refresh-and-retry on a mid-session 401. `middleware.ts` is the real server-side gate on `/admin/*`; the client-side check is a UX backstop, not the security boundary.
- **Data layer**: one thin wrapper per backend module under `lib/api/`, mirroring the backend's own module boundaries 1:1. `lib/fetcher.ts` is the single place that unwraps the API's `{success, data, message}` envelope and owns the refresh/retry logic.
- **Error handling**: every API error surfaces the backend's own `message` field, verbatim. Never a raw HTTP status code, never a generic fallback string, except for genuine network failures with no response body at all, which get one fixed, hardcoded message.

Full page-by-page specifications live in `Liko_Frontend_TAD.md`; design tokens and rationale live in `DESIGN.md`.

## Project Structure

```
app/
├── (public)/          Public site route group (SSG/ISR/SSR per route)
├── admin/             Admin panel (client-rendered, see Architecture)
├── login/             Auth pages (outside the (public) group)
├── globals.css        All design tokens, single source of truth
├── sitemap.ts
└── robots.ts
components/
├── public/            Public-site components
├── admin/             Admin-panel components
└── ui/                Shared primitives (ConfirmDialog, ToastViewport, modal base styles)
lib/
├── api/               One wrapper per backend module
├── auth/              AuthProvider, usePermission
├── constants/         Company info, application status transition map
├── context/           ToastContext
├── hooks/             Shared calculation hooks (e.g. fee totals)
├── validation/        Client-side pre-checks (ID number, ported from the backend)
└── fetcher.ts          Envelope unwrap, error handling, auth refresh/retry
types/
└── api.ts             Types matching the actual backend models
tests/
├── unit/              Vitest
└── e2e/               Playwright
```

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the Liko backend (`liko-backend`), reachable over HTTP

### Installation

```bash
git clone <repository-url>
cd liko-frontend
npm install
cp .env.example .env.local
npm run dev
```

The app runs at `http://localhost:3000` by default.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API, including version prefix | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Canonical public site URL, used by `sitemap.ts`/`robots.ts` | `https://liko-security-training.example` |

**Note:** the backend's own `FRONTEND_URL` variable (used for CORS) defaults to `http://localhost:5173`, while Next.js dev defaults to port `3000`. Confirm these match wherever the backend runs, or credentialed requests (auth cookies) will be silently rejected by CORS.

### Fonts

**Current state (temporary):** fonts are loaded via `next/font/google` (Fraunces, Source Sans 3, IBM Plex Mono). This is a deliberate short-term deviation from the original design, adopted to unblock a Netlify deploy after the real `.woff2` files were never committed to the repo, which failed the production build with `Module not found` errors.

**Intended state, per `DESIGN.md` §6:** fonts should be self-hosted via `next/font/local`, avoiding any runtime dependency on Google's font CDN, which matters for the 3G-constrained audience this site targets. To restore that:

1. Download the three families (all open-license): [Fraunces](https://fonts.google.com/specimen/Fraunces), [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)
2. Convert to `.woff2` if needed and place at:
   ```
   public/fonts/fraunces/Fraunces-Regular.woff2       (weight 600)
   public/fonts/fraunces/Fraunces-Bold.woff2          (weight 700)
   public/fonts/source-sans/SourceSans3-Regular.woff2
   public/fonts/source-sans/SourceSans3-SemiBold.woff2
   public/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2
   ```
3. Revert `app/layout.tsx` back to `next/font/local` (see git history for the prior version, or the comment left in the current file).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit`, strict mode |
| `npm run lint` | ESLint and Stylelint |
| `npm run test` | Unit tests (Vitest) |
| `npm run e2e` | End-to-end tests (Playwright), see [Testing](#testing) |

## Testing

**Unit tests** (`tests/unit/`) cover pure logic with no DOM dependency: ID number validation (SA ID Luhn check, passport format) and the API client's envelope-unwrapping, error-surfacing, and auth-refresh-retry behavior. Run with `npm run test`.

**End-to-end tests** (`tests/e2e/`) are written against real component selectors and cover the application flow, login/MFA, permission boundaries on the application status workflow, and error-path handling. They require a running backend, real seeded test accounts, and browser binaries that are not installed by default:

```bash
npx playwright install
npm run e2e
```

Each spec file documents the specific environment variables it needs at the top of the file.

## Design System

All colors, typography, spacing, and radius values are defined once as CSS custom properties in `app/globals.css`, per `DESIGN.md`. `.stylelintrc.json` mechanically enforces that no raw hex, pixel, or non-approved font value appears in any component's `.module.css` file.

`COMPLIANCE_SWEEP.md` documents the project's audit against `Liko_Frontend_Design_Research-1.md`'s anti-pattern catalog (gradient buttons, nested cards, hero-metric dashboards, and similar), including the specific instances that were caught and corrected during the build rather than a restatement of the source document's own table.

## How This Was Verified

This project was built by reading the backend's actual source code, not only the specification documents, and several real discrepancies were caught as a result:

- `Application.coursesSelected` and `preferredIntake` are populated objects (`{grade, title, fee}`, `{title, startDate}`) in list/detail API responses, not bare ID strings, confirmed against the backend's `.populate()` calls.
- The `payment_verified` status transition requires both `applications:write` and `invoices:issue`, not either alone, confirmed in the backend's permission logic.
- ID document uploads are capped at 10MB, JPEG/PNG/PDF only, validated server-side by file content rather than extension, confirmed by reading the upload middleware directly.
- The roles update endpoint only ever accepts a `permissions` array; renaming a role is not a supported operation, confirmed against the backend's validation schema.
- No delete route exists for courses or roles, confirmed by reading the route definitions, so no delete UI was built for either.

## Known Gaps and Deliberate Deviations

These are flagged intentionally rather than shipped silently:

1. **Gallery and FAQ reordering** use up/down buttons rather than drag-and-drop. No drag-and-drop library is in the approved dependency list; a library such as `@dnd-kit` would need to be added for true drag support.
2. **PSIRA and training centre numbers** in `lib/constants/company.ts` are sourced from a layout mockup in `DESIGN.md`, not an independently verified PSIRA certificate.
3. **Enrollment prerequisites** shown on the courses page are structural placeholders, not client-confirmed content.
4. **Terms and Privacy Policy pages** define structure only. Legal copy is out of scope for this codebase and must be supplied by the client or legal counsel.
5. **Playwright specs are authored but not executed** in the environment this project was built in, which had no network access to install browser binaries or reach a live backend.
6. **Fonts currently load via `next/font/google`, not the originally specified `next/font/local`.** Adopted to unblock a Netlify deploy after the real font files were never committed. See [Fonts](#fonts) for how to revert.

## CI/CD

`.github/workflows/ci.yml` runs on every pull request and push to `main`:

1. TypeScript strict typecheck
2. ESLint and Stylelint
3. A dedicated check that fails the build on any em dash in source, markdown, or config files
4. Vitest unit tests
5. Playwright end-to-end tests
6. Lighthouse CI under simulated slow-3G throttling, matching the target audience's real network conditions

## Contributing

This is an internal client project rather than an open-source library, but the same discipline applies to any change:

- Check `Liko_Frontend_TAD.md` before adding a route, changing a rendering strategy, or introducing a new data-fetching pattern.
- Check `DESIGN.md`'s token tables before adding any color, spacing, radius, or font value; never hardcode a raw value in a `.module.css` file.
- Never use an em dash anywhere in the project, including code comments. This is enforced in CI.
- Run `npm run typecheck` and `npm run lint` before opening a pull request.

## License

Proprietary. All rights reserved. This codebase is the property of Liko Security Training and is not licensed for reuse outside this engagement.

## Maintainers

Frontend build and this documentation prepared as part of the Liko Security Training platform engagement. Direct questions to the project's technical point of contact.
