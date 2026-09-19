# Implementing a Stitch screen

How to turn a Stitch export into a real Relicto page. Follow it for every new
screen. The finished references are the auth pages (`src/modules/auth`) and
the game hub (`src/modules/hub`).

## 1. Inputs

Every screen has three files. Read all of them before writing code.

| File | Use it for |
| --- | --- |
| `code.html` | Structure, class names, copy. This is the source of truth for spacing, type and colour. |
| `DESIGN.md` | Token names and values (colours, type roles, spacing). |
| `screen.png` | What it must look like. Stitch renders it at 1280px wide with the Tailwind **v3** CDN. |

To pull new or updated screens, use the `stitch` MCP server on project
`16773524343330526083` (`list_screens`, then `get_screen`). Save them as
`docs/design/stitch/lootora/<slug>/{code.html,DESIGN.md,screen.png}` and add a
row to `README.md`. Download the export's remote images
(`lh3.googleusercontent.com/...`) into `public/images/lootora/<page>-NN.jpg`.
Never hotlink them.

Brand: the designs say "Lootora". The product is **Relicto**. Write Relicto everywhere.

## 2. Write the code by hand

Don't use a converter or paste HTML. Read the export, then build the page as
components.

1. Sketch the component tree from `screen.png`: sections, then cards and rows.
   Anything repeated becomes one component that maps over data.
2. Move every visible value (names, prices, badges, counts) into typed mock data.
3. List the interactions: tabs, filters, sorts, menus, timers, buttons. They go
   in hooks, and pure logic goes in `lib/`.
4. Before writing a component, check the shared pieces (section 4). Reuse them
   instead of writing new ones.

## 3. Module layout

```
src/modules/<domain>/
  types.ts                 data contracts shared by mocks, lib and components
  data/*.mock.ts           mock payloads (plain JSON-like objects, no JSX)
  data/get-<domain>.ts     "server-only" async loader: the future API boundary
  lib/                     pure functions and class maps (tones, filter/sort)
  hooks/                   client state (use-*.ts)
  components/<section>/    one folder per page section
  components/<domain>-view.tsx   page composition, server component
src/app/(lootora)/<route>/page.tsx   metadata, then `await get*()`, then <View data={...} />
```

- No file over 200 lines. Keep JSX presentational. State lives in hooks.
- Server components by default. Add `"use client"` only to the leaf that needs
  state. Pass server-rendered sections as `children` through a client wrapper
  (see `hub/components/stage/game-stage.tsx`).
- Header and footer families live in `src/modules/relicto/components/shell`
  (`market`, `ledger`, `studio`, `hub`). A new family adds a variant to the
  existing `NavLinks`, `WalletChip`, `NotificationsMenu` and `UserMenu` rather
  than forking them. The auth screens use `modules/auth/components/shell`.

## 4. Components: shadcn only, no native controls

| Need | Use |
| --- | --- |
| Button | `Button` from `@/components/ui/button`. `variant={null} size={null}` starts unstyled; put the design classes in `className`. |
| Link styled as a button | `LinkButton` (`@/components/ui/link-button`) |
| Action with no backend yet | `NoticeButton` (`@/components/notice-button`), which shows a toast |
| Text field | `Input`, or `AuthField` in auth |
| Checkbox, radio cards | `Checkbox`, `RadioGroup` |
| Segmented control or tabs | `SegmentedTabs` (built on shadcn Tabs) |
| Dropdown select | `Select` from `@/components/ui/select`. Style the closed trigger via `triggerClassName`. `indicator` swaps in a Lucide chevron. |
| Menus, popovers | `DropdownMenu`, `Popover` (Base UI: use `render` instead of `asChild`, and `onClick` on menu items) |
| Live countdown | `CountdownText` + `useCountdown` |
| Link to an unbuilt page | `SoonLink`, or `comingSoon: true` on a `NavItem` |

The shadcn base classes fight the design. Override them explicitly:

- `border border-transparent`: add `border-0` when the design element has no border (otherwise it's 2px too big).
- Fixed heights (`h-8`, `h-9`): add `h-auto`, or set the design height.
- `text-sm font-medium`: set the design size and weight. `Input` also has `md:text-sm`, so add `md:text-xs` etc.
- `TabsTrigger`: add `flex-none` (the base is `flex-1`), set `font-normal`, and override the active shadow with `group-data-[variant=default]/tabs-list:data-active:shadow-*`.
- `TabsList` is `w-fit h-8`. `SegmentedTabs` resets the height; pass `w-auto` when it shouldn't stretch.
- Button forces unsized SVGs to `size-4`. Always give icons a `size-*` class.
- A `<button>` may only contain phrasing content. Use `<span className="block|flex">` instead of `div`, `h5` or `p` (see `hub/components/community/thread-row.tsx`).

Icons: exports that use Material Symbols map to `<Icon name>` (add the glyph to
`ICON_NAMES`). Exports that use `data-lucide` map to `lucide-react`, with
canonical names: `home` is `House`, `line-chart` is `ChartLine`, `check-circle-2` is `CircleCheck`.

## 5. Tokens and themes

- **No hex in components.** Colours come from tokens:
  - Stitch tokens: `src/styles/theme/colors.css`, `typography.css`.
  - Tailwind v3 palette classes (`text-amber-400`, `bg-indigo-600/10`): pinned to v3 hex in `palette.css`. If a shade is missing, add its v3 hex there.
  - One-offs get a named token in `colors.css`.
- Compare the export's `<script id="tailwind-config">` against `DESIGN.md`. If
  it overrides colours or fonts, add or reuse a scope in `scopes.css`
  (`.theme-auth*`, `.theme-hub`) and put the class on the page root.
- Radius: the global scale is Stitch's (`rounded` is 2px, `rounded-full` is
  12px). Exports without a `borderRadius` override use stock Tailwind corners.
  Their scope restores the stock values (see `.theme-auth, .theme-hub`).
- Scopes don't reach portals. Popovers and menus use the global tokens.

## 6. Tailwind v3 to v4 translation

Stitch renders with v3 and we build with v4. These rules are where the pixels go wrong:

| v3 in the export | Write in v4 |
| --- | --- |
| `shadow-sm` / `shadow` | `shadow-xs` / `shadow-sm` |
| `blur-sm`, `backdrop-blur-sm` / `blur`, `backdrop-blur` | `-xs` / `-sm` |
| `rounded-sm` | `rounded-xs` |
| `outline-none` | `outline-hidden` |
| `bg-gradient-to-r` | `bg-linear-to-r/srgb` (keeps v3's sRGB interpolation) |
| `bg-<rgba-token>/NN` | v3 *replaces* the alpha, v4 *multiplies* it. Use an opaque base token (`overlay-base/90`) or `rgb(r_g_b/0.NN)`. |
| `border` with no colour | v3 default is gray-200, so add `border-gray-200` |
| placeholder with no colour | v3 default is gray-400, so add `placeholder:text-gray-400` |
| invalid classes (`py-0.2`) | v3 ignores them. Drop them. |

**Line-height is the big one.**

- v3 `text-*` sets an *absolute* line-height (`text-xs` is `1rem`), and children inherit it as px. v4 uses unitless ratios. When a parent has `text-xs`/`text-sm` and a child uses `text-[10px]` with no `leading-*`, add `leading-4`/`leading-5` to the parent.
- v3 emits responsive utilities after base ones, so `leading-tight sm:text-3xl` gets text-3xl's line-height at `sm`. In v4, an explicit `leading-*` wins at every breakpoint. Add the v3 value per breakpoint: `text-base` is `leading-6`, `text-2xl` is `leading-8`, `text-3xl` is `leading-9`, `text-4xl` is `leading-10`.
- Built-in `text-xs`/`text-sm` beat custom text roles. Custom roles are registered for `tailwind-merge` in `src/lib/cn.ts`.

## 7. Data and behaviour

- The page calls `get<Domain>()`, which returns mocks typed by `types.ts`. When the API lands, only that file changes.
- Derive values instead of duplicating them. For example, the loadout appraisal is the sum of its items.
- Make controls work: tabs switch content, filters and sorts reorder data, menus open, timers tick. If the result would come from a backend, confirm with a toast.
- The session user, notifications and wallet come from `SessionProvider` (`modules/relicto`). Never hard-code them per page.

## 8. Verify against the design

The dev server runs on :3000. Use Node 22.

```bash
node scripts/design/shoot.mjs http://localhost:3000/<route> "$TEMP/app.png" 1280 900
powershell -File scripts/design/grid.ps1 -A docs/design/stitch/lootora/<slug>/screen.png -B "$TEMP/app.png"
powershell -File scripts/design/compare.ps1 -A <design.png> -B "$TEMP/app.png" -X 0 -Y 0 -W 640 -H 400 -Out "$TEMP/crop.png"
```

- `shoot.mjs` captures the full page with a 900px viewport, so `min-h-screen` behaves the way it did in Stitch. The page height should equal the design's.
- `grid.ps1` prints the overall diff and the worst 320×160 cells. `compare.ps1` writes design | app | heatmap for one region. Open it and look.
- Aim for under ~3% overall. Every remaining hotspot must be explainable: live data (countdowns, session wallet), the brand rename, or 1px font baseline noise.
- If a style change doesn't appear, Turbopack may have missed the file event. Make a real content change to the CSS file.

## 9. Before committing

- [ ] `npx tsc --noEmit` and `npx eslint` are clean. Run `npx next typegen` if `PageProps` is missing.
- [ ] No file over 200 lines, no hex literals, no native `<button>`/`<input>`/`<select>`.
- [ ] Controls work, and nothing hydrates differently (check the console).
- [ ] Diff numbers are recorded in the commit message or PR.
- [ ] The screen's row in `README.md` is updated.
