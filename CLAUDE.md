@AGENTS.md

# Project rules

- UI must match the Stitch designs in `docs/design/stitch/` pixel for pixel. Before building or changing a screen, read `docs/design/IMPLEMENTING.md` (workflow, shadcn overrides, v3→v4 rules, diff tooling) and verify with `scripts/design/`.
- Hand-write components from the export (`code.html` + `DESIGN.md` + `screen.png`). No HTML-to-JSX converters. Controls are shadcn components (`Button`, `LinkButton`, `Input`, `Select`, `SegmentedTabs`...), never native `<button>`/`<input>`/`<select>`.
- One component per concern. No source file over 200 lines. Keep state and logic in `hooks/` and `lib/`, and keep JSX presentational.
- Module layout is `src/modules/<domain>/{components,hooks,lib,data}` plus `*.types.ts`. Page data goes through `data/get-*.ts`. It returns mocks for now; when the backend lands, swap in queries with the same types.
- Use the design-token class names. Never hardcode hex colors in components. Tailwind v3 palette shades are pinned in `src/styles/theme/palette.css`, and one-offs get a token in `colors.css`.
- The designs say "Lootora". The product is **Relicto**.
- Use Node 22 (`.nvmrc`). This machine defaults to Node 16.
