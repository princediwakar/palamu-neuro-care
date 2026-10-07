# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Behavioral Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

- Source files (.ts/.tsx) should stay under 300 lines. If a file crosses 400, split it or refactor into smaller modules.
- JSON data files and auto-generated files (package-lock.json, content-dates.json) are exempt.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Remove imports/variables/functions that YOUR changes made unused — but don't delete pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Keep CLAUDE.md Current

**After any change that alters architecture, adds a pattern, introduces a dependency, or shifts conventions — update this file.**

- If you add a new package, note it in Tech Stack.
- If you create a new route group, directory, or component convention, add it to Architecture.
- If you change how data flows, how pages render, or how i18n works, reflect it.
- If a command, env var, or build hook is added/removed, update Commands or Environment Variables.
- Don't document things derivable from reading a single file — only cross-cutting architecture that requires reading multiple files to understand.
- Keep sections concise. If a section grows stale, rewrite it rather than appending.

The test: A new Claude instance reading this file should be as productive as you were at the end of your session.

### 5. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan with verifiable checkpoints before starting.

### 6. Plans Structured for Parallel Execution

**Every plan must be presented as parallelizable tracks.**

- Break the plan into independent tracks that share no dependencies and can be worked on concurrently.
- Each track must have a clear, self-contained goal — someone picking up a single track should know exactly what to do without reading the others.
- List shared context (conventions, types, file paths) upfront so all tracks align without coordination.
- If tracks have ordering dependencies, call them out explicitly (e.g., "Track B depends on Track A completing first").
- Each track ends with its own verification step (build, lint, manual check) so it can be validated independently.

---

## Commands

```
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Production build (runs prebuild → next build)
npm run start     # Start production server
npm run lint      # Run ESLint
```

**Build hooks:**
- `postinstall` — copies `scripts/pre-commit.sh` to `.git/hooks/pre-commit`
- `prebuild` — runs `scripts/generate-content-dates.mjs` to regenerate `lib/seo-pages/content-dates.json` from git history

There is no test runner configured (no jest/vitest).

## Tech Stack

- Next.js 16 (App Router) with React 19 and TypeScript (strict, but `ignoreBuildErrors: true` in next.config)
- Tailwind CSS v4 (CSS-first config via `@import "tailwindcss"` + `@theme inline` block in `app/globals.css`)
- `next-intl` for i18n (English `en` and Hindi `hi`, default locale `en`)
- shadcn/ui (new-york style) — Button, Accordion, Carousel (Embla), DropdownMenu, ThemeProvider
- Icons: Lucide React; Carousel: embla-carousel-react; Theme: next-themes
- Analytics: Google Tag Manager (via `NEXT_PUBLIC_GTM_ID` env var)
- `cn()` helper in `lib/utils.ts` (clsx + tailwind-merge)

## Environment Variables

- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager container ID (falls back to a hardcoded default)
- `NEXT_PUBLIC_BASE_URL` — used in `app/metadata.ts` for Open Graph image URLs

---

## Architecture

### Internationalization (i18n)

All routes live under `app/[lang]/`. The `[lang]` layout (`app/[lang]/layout.tsx`) validates the locale against `routing.locales`, loads messages via `next-intl`, and wraps everything in `<NextIntlClientProvider>`, `<Navbar>`, and `<SiteFooter>`.

- **Locale prefix:** `as-needed` — English is the default locale (no URL prefix), Hindi gets `/hi/` prefix (e.g., `/hi/migraine-ka-ilaj`).
- **Config:** `i18n/routing.ts` defines locales and routing. `i18n/request.ts` lazy-loads message JSON from `messages/{locale}.json`.
- The root `app/layout.tsx` is an outer shell with `<html lang>`, GTM, and `<ThemeProvider>`.

### Route structure (App Router)

```
app/
  layout.tsx                    # Root layout: <html>, GTM, ThemeProvider
  [lang]/
    layout.tsx                  # Locale layout: validates lang, NextIntlClientProvider, Navbar, Footer
    page.tsx                    # Homepage
    [slug]/page.tsx             # Dynamic SEO landing pages (catch-all)
    doctors/page.tsx            # Doctor listing
    gallery/page.tsx            # Photo gallery
    videos/page.tsx             # Video page
    (specialties)/
      neurology/page.tsx        # Neurology specialty landing
      ophthalmology/page.tsx    # Ophthalmology specialty landing
    (legal)/
      privacy/page.tsx          # Privacy policy
      terms/page.tsx            # Terms of service
```

### SEO landing page system (`lib/seo-pages/`)

This is the core data-driven architecture. Every SEO landing page is rendered from `app/[lang]/[slug]/page.tsx`.

- **`types.ts`** — Discriminated union of 7 page categories: `specialist`, `condition`, `diagnostic`, `symptom`, `location`, `info`, `doctor`. Each category extends `SeoPageBase` with category-specific fields.
- **`constants.ts`** — Clinic info, doctor bios, addresses, social links. Used throughout the site and in JSON-LD generation.
- **`registry.ts`** — Imports all page arrays from `data/en/*` and `data/hi/*`, builds `Map<string, SeoPage>` lookups for both languages. Exports `getSeoPage(slug, lang)`, `getAllSlugs(lang)`, `getPagesByCategory()`, `getRelatedPages(slugs, lang)`. Cross-language slug mapping (`enToHiSlug`, `hiToEnSlug`) is built from positional correspondence between the parallel en/hi arrays.
- **`metadata-factory.ts`** — Converts a `SeoPage` into Next.js `Metadata` (with hreflang alternates) and schema.org JSON-LD blocks (MedicalClinic, BreadcrumbList, FAQPage, Physician, MedicalCondition, MedicalProcedure). Dates come from `content-dates.ts`.
- **`content-dates.ts`** — Reads `content-dates.json` (auto-generated during prebuild) to provide `datePublished`/`dateModified` per slug from git history.
- **`featured-pages.ts`** — Hand-picked slug lists for featured sections on the homepage and footer. Resolves slugs to `{ slug, title, description }` objects via the registry.
- **`data/en/*.ts`** and **`data/hi/*.ts`** — Barrel files that import from split JSON files (e.g., `conditions-1.json` through `conditions-10.json`) and re-export them as typed arrays. Each language has structurally identical files with localized content.

### Data file convention

Page content is stored as **JSON arrays** under `lib/seo-pages/data/en/` and `lib/seo-pages/data/hi/`. Barrel `.ts` files import the JSON and re-export typed arrays:

```ts
// lib/seo-pages/data/en/info.ts
import infoPages1 from "./info-1.json";
import infoPages2 from "./info-2.json";

export const infoPages: InfoSeoPage[] = [
  ...(infoPages1 as InfoSeoPage[]),
  ...(infoPages2 as InfoSeoPage[]),
];
```

When adding a new page, add it to the appropriate JSON file. When adding a new language, create parallel JSON files under `data/hi/` with matching barrel files.

### How `[slug]` pages render

1. `generateStaticParams()` returns all slugs for both `en` and `hi` locales. `dynamicParams = false` means any unknown slug 404s at runtime.
2. `generateMetadata()` looks up the page via `getSeoPage(slug, lang)` and calls `seoMetadata()` from the metadata factory.
3. The page component: `getSeoPage()` → switch on `page.category` → matching `templates/seo/*-template.tsx`, wrapped in `<JsonLdScripts>`, `<Breadcrumbs>`, and `<ClinicInfoBar>`.

### Component organization

| Directory | Purpose |
|---|---|
| `components/sections/` | Full-page sections: hero, navbar, footer, services, doctors, testimonials, FAQ, CTA, gallery, map, benefits |
| `components/seo/` | Reusable blocks for SEO landing pages: breadcrumbs, clinic-info-bar, condition cards, procedure steps, warning signs, JSON-LD, related pages, comparison table |
| `components/shared/` | Generic utilities: max-width-wrapper, header-section, blur-image, callout, icons, copy-button, page-header |
| `components/ui/` | shadcn/ui primitives: button, accordion, carousel, dropdown-menu |
| `templates/seo/` | One template per page category — receives the typed `SeoPage` and renders the full layout |

### Styling

- Tailwind v4 uses CSS-first config (no `tailwind.config.ts`). Theme variables defined in `@theme inline` block in `app/globals.css`.
- OKLCH color space for all theme tokens. Light/dark mode via `.dark` class selector using `@custom-variant dark`.
- `tw-animate-css` for animation utilities.
- Path alias: `@/*` → `./*` (project root).

### Static assets

- `public/_static/illustrations/` — hero images, doctor photos, clinic exterior
- `utils/getGalleryImages.ts` — reads gallery images for the carousel

### Scripts

- `scripts/generate-content-dates.mjs` — scans data JSON files, extracts slugs, and uses `git log` to populate `content-dates.json` with `datePublished`/`dateModified` per slug. Runs automatically during `prebuild`.
- `scripts/translate.ts` — translation utility (uses `openai` SDK).
- `scripts/pre-commit.sh` — installed as git pre-commit hook via `postinstall`. Runs linting on staged files.
