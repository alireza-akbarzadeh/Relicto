# Relicto

Gaming platform for Dota 2 and CS2: tournaments, a game wiki, a patch tracker, and later an item marketplace. It's a Next.js 16 modular monolith.

## Current status

- **Arena hub** (`/tournaments`) implements the Stitch designs in `docs/design/stitch/`: the desktop and mobile compositions, with mock data.
- The backend (Drizzle + Neon Postgres, Better Auth with Steam login, Valve datafeed sync) comes next. Dependencies are installed and Neon is linked, but no schema exists yet.

## Getting started

Requires Node 22 (`.nvmrc`).

```bash
nvm use 22.23.1
npm install
npm run dev
```

`/` redirects to `/tournaments`. `.env.local` holds `DATABASE_URL` (Neon) and the Better Auth secrets. See `.env.example`.

## Structure

```
src/
  app/                    routes (thin: load data, render a module view)
  components/ui/          design-system primitives (Icon, Dot, ProgressBar)
  lib/                    cn(), fonts, generic helpers
  styles/theme/           Stitch design tokens (colors, type, spacing, radius)
  modules/<domain>/
    components/           view components, split by layout and section
    hooks/                client state (selection context, filters, countdowns)
    lib/                  pure logic: formatting, tone → class maps, filtering
    data/                 page data access (mock today, queries later, same types)
    *.types.ts            domain types
```

Conventions: one component per concern, no file over 200 lines, and state and logic kept in `hooks/` and `lib/` so JSX files stay presentational.

## Design system

The tokens mirror Stitch's names one-to-one (`bg-surface-card`, `font-label-caps text-label-caps`, `px-margin-desktop`), so design markup ports without translation. Watch for these differences from stock Tailwind:

- `rounded-full` is **12px** and `rounded` is 2px, because Stitch overrides the radius scale.
- Use `overlay-base/<alpha>` where the design writes `surface-overlay/<alpha>`. Tailwind v3 replaced the alpha; v4 multiplies it.
- Icons are Material Symbols, subset to the names in `components/ui/icon/icon-names.ts`. Add a name there before using it.
