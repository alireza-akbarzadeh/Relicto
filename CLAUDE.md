@AGENTS.md

# Project rules

- UI must match the Stitch designs in `docs/design/stitch/` pixel for pixel. Compare against the rendered Stitch HTML, not memory.
- One component per concern. No source file over 200 lines. Keep state and logic in `hooks/` and `lib/`, and keep JSX presentational.
- Module layout is `src/modules/<domain>/{components,hooks,lib,data}` plus `*.types.ts`. Page data goes through `data/get-*.ts`. It returns mocks for now; when the backend lands, swap in queries with the same types.
- Use the design-token class names (see README "Design system"). Never hardcode hex colors in components.
- Use Node 22 (`.nvmrc`). This machine defaults to Node 16.
