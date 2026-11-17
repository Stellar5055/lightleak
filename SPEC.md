# Lightleak — SPEC v1.1

**Status:** UI mockup phase · no simulation implemented
**Target:** 25–30 focused hours, including agentic coding
**Deliverable:** a static React mockup first, then the real app
**Stack:** Vite + React + TypeScript + Tailwind 4 + shadcn/ui
**3D (later):** Three.js in one canvas component
**Hosting:** GitHub Pages

### Mockup status (17 Nov 2026)

S0–S10 are built in the working tree (S4's live Pages URL is still pending). The
mockup is interactive: home, import / create-new, prism / ball / blank scenes,
specimen rail, inspector sliders, source bar, help, ray readout, export dialog,
share toast and mobile layout. The scene is SVG and the solver is a UI timer.
Simulation has not started. **S11 is next.** See `MOCKUP.md` and §18 for the
full stage list.

This supersedes v1.0. The old ivory/brass instrument UI is gone. The homepage
hero is now based on the 21st.dev hero structure: grid, radial accent, eyebrow,
gradient title, CTA, fade choreography — restyled to Lightleak.

---

## 1. Product

Two pages:

1. **Home** — a hero and two start actions.
2. **Scene** — the laboratory: a large dark chamber, a specimen rail, an
   inspector, and source controls.

The loop:

> Open the link → see the hero → Create new scene or Import a scene → the lab
> opens → move the glass, change the material, read a ray.

The mockup proves the interface and the flow. It does not simulate light.

---

## 2. Decisions locked

| Decision | Choice |
|---|---|
| Platform | Web, fully static |
| UI stack | React 19 + Vite + TypeScript + Tailwind 4 + shadcn/ui |
| Hero base | 21st.dev hero structure, rewritten for Lightleak |
| Routing | Hash routes, no server rewrites |
| Hosting | GitHub Pages via Actions |
| 3D | Three.js in one imperative canvas component, later |
| Mockup scene | Inline SVG illustration |
| Theme | Monochrome optical lab, spectrum only in the light |
| Presets | Prism Rainbow, Ball Lens, Blank Bench |
| Scene state | React state now, Zustand when the simulation lands |

The 21st.dev hero is the **base layout**, not the final skin. The purple border,
Geist, gradient-clipped title, Unsplash imagery and default rounded pill button
are replaced.

---

## 3. Design direction

**A monochrome optical lab, in the dark.** Near-black paper, off-white ink,
hairline rules, a technical grid. The only colour on the page is the light
itself: the beam, the spectrum, and one small red LED.

This is a deliberate break from the earlier ivory/brass instrument. Brass stays
inside the 3D scene as a material, not in the UI.

### Palette

| Token | Value | Use |
|---|---|---|
| Paper | `#0A0A0A` | page background |
| Surface | `#121316` | cards, panels, bars |
| Ink | `#F2F2EE` | text, buttons, rules |
| Muted | `#96968F` | secondary text |
| Hairline | `#26272B` | borders, dividers |
| Chamber | `#050607` | scene viewport |
| Signal | `#FF5A45` | solver LED, live dot, destructive |
| Spectrum | 430–670 nm | only inside the optical illustration |

### Type

| Role | Face |
|---|---|
| UI, hero title | Instrument Sans |
| Wordmark, scene titles, accents | Newsreader (italic allowed) |
| Numbers, labels, units | IBM Plex Mono |

No Inter, Roboto, Space Grotesk, system-ui, or Geist.

### Brand assets

- Source plate: `assets/brand/prism-source.png`.
- Conversion: `scripts/brand_assets.py` (Pillow), reproducible.
- Favicon: `favicon.ico` + 16 / 32 / 192 / 512 PNG, `apple-touch-icon.png`,
  `favicon-maskable-512.png`, `site.webmanifest`.
- UI badge: `src/assets/brand-mark.png` — header, scene top bar, eyebrow pill,
  footer. Rounded black plate, cropped tight around the prism.
- Social card: `public/og-image.jpg`, 1200 × 630, prism plate + wordmark.
- No stock imagery. Every icon is cropped from the same source plate.

### Shape and motion

- Cards: 12 px radius, 1 px hairline, soft shadow.
- Buttons: 8 px radius; the eyebrow is the only pill.
- Hero title: gradient from ink to 35% ink, one italic word.
- Grid: 96 px technical grid at 4% ink, masked radially.
- One hero sequence: title fades in, grid settles, the radial accent rises.
- Page change: 250 ms fade.
- Reduced motion: instant, no beam draw, no page fade.

---

## 4. Homepage

### Header

- Brand badge: the prism/rainbow plate, 28 px, rounded.
- Wordmark: `Lightleak` in Newsreader italic.
- Small mono tag: `OPTICAL LAB`.
- Nav: `Import` (opens the import dialog), `New scene` (blank bench).

### Hero

Adapted from the 21st.dev component:

- Eyebrow pill: static, brand badge + `A VIRTUAL OPTICAL LABORATORY`.
- Title: **“See what light does.”** — `light` in italic Newsreader.
- Subtitle: “A virtual optical bench. Place glass, aim a beam, and watch every
  ray bend, split and focus.”
- Primary CTA: **Create new scene** → `#/scene?preset=blank`.
- Secondary: **Import a scene** → opens the import dialog.
- Small line: “Open source · built for Hack Club Crossroads.”
- Background: a technical grid masked at the top; a giant radial ellipse rises
  from the fold — the 21st.dev dark accent: near-black centre, light rim. It
  contains no illustration and no text. The bottom fade blends it into the page.
- The hero uses the 21st.dev radial accent and bottom fade literally. No sample
  picture lives inside the ellipse.

### Start options

No card library. Two actions, carried by the hero and repeated in the header:

- **Create new scene** → `#/scene?preset=blank`. The blank bench offers
  “Add a prism” and “Add a sphere.”
- **Import a scene** → a dialog with a scene-link field. The mockup validates
  `#/scene?preset=…`, opens that scene and shows `Scene imported.` An invalid
  link shows an inline error. Cancel, backdrop and `Esc` close it.

The Prism Rainbow and Ball Lens presets stay reachable inside the scene page’s
preset switch and the blank bench add actions.

### Footer

`Lightleak` (badge + wordmark) · open source · MIT · built for Hack Club
Crossroads · physics:
Snell, Fresnel, Cauchy. No dead links.

---

## 5. Scene page

### Top bar

- Back arrow + brand badge + wordmark → home.
- Scene name: `Prism Rainbow` / `Ball Lens` / `New Scene`.
- Preset switch: `01 Prism` / `02 Ball`.
- Actions: Rays toggle, Measure, Help, Share, Export.

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ ← Lightleak / Prism Rainbow   [01 Prism][02 Ball]  ◉ ? ↗ ⤓  │ 64
├──────────┬──────────────────────────────────────┬────────────┤
│ SPECIMENS│                                      │ INSPECTOR  │
│ ○ sphere │        dark optical chamber           │ material   │
│ △ prism  │        SVG mock scene                 │ IOR        │
│ ▭ mirror │                                      │ dispersion │
│          │                                      │ size/rotate│
│ PRESETS  │                                      │ critical   │
│ 01 prism │                                      │ [REMOVE]   │
│ 02 ball  │                                      │            │
│ new      │                                      │            │
├──────────┴──────────────────────────────────────┴────────────┤
│ SOURCE   angle ──○──  width ──○──  [White][Mono]   ● READY    │
└──────────────────────────────────────────────────────────────┘
```

- Outer page: near-black, technical grid at very low opacity.
- Panels: dark surface, 12 px radius, 1 px hairline, soft shadow.
- Chamber: near-black, 16 px radius, large; the SVG covers it.
- Top-left overlay: `PRISM / n 1.520`; top-right: `λ 430–670 nm`;
  bottom-left hints; bottom-right `LL-01`.

### Left rail

- **Specimens:** Sphere, Prism, Mirror. The active specimen is ink-filled with
  a red dot. Clicking:
  - Prism → Prism scene.
  - Sphere → Ball scene.
  - Mirror → toast: “Mirror scene is not in this mockup.”
- **Presets:** 01 Prism Rainbow, 02 Ball Lens, New scene.
- **Bench:** specimens `01 / 06`, glass `01 / 03`, receivers `02`.

### Inspector

- Header `INSPECTOR`, then `Prism 01` / `Sphere 01` / `No specimen`.
- Material segmented control: Glass, Water, Diamond.
- Sliders: IOR, dispersion, side/radius, rotation (prism only).
- Readouts: critical angle, medium, wavelength.
- Remove specimen → blank bench + toast.
- Sliders update the readout and trigger a mock solver busy state.
- Blank scene: “Add a prism” and “Add a sphere” buttons.

### Source bar

- Angle: −60°…+60°.
- Width: 2…16 mm.
- Spectrum: White / Mono.
- Solver LED: `READY` / `BUSY`.
- Changing a control fades the LED to busy for ~650 ms.

### Overlays

- **Help sheet:** right-side dark panel. What this is, controls, what is real,
  what is approximated, credits. Backdrop, Esc closes.
- **Ray readout:** click a ray in the SVG. White card over the chamber:
  wavelength, media, incidence, refraction, critical angle, Fresnel R. TIR
  state in signal red. Esc/× closes.
- **Export dialog:** preview of the scene plate, caption, “Download SVG”
  (mock-only), close.
- **Toast:** bottom-right, inverted (light on dark), auto-dismiss.

### Interactions in the mockup

| Action | Result |
|---|---|
| Create new scene | Opens the blank bench |
| Import a scene | Opens the dialog; a valid link loads the scene |
| Back / wordmark | Home |
| Preset switch | Prism ↔ Ball |
| New scene | Blank bench |
| Specimen tile | Selects or switches scene |
| Material button | Updates IOR/dispersion values |
| Slider | Updates readout, solver busy |
| Rays toggle / `R` | Hides/shows beam overlay |
| Click a ray | Opens the readout |
| Help / `?` | Opens the help sheet |
| Share | Copies URL, toast |
| Export | Opens dialog |
| Remove | Blank bench, toast |
| `Esc` | Closes the top overlay |

S0–S10 render the chamber as SVG with mock values. S14 replaces it with
Three.js; S15–S19 make rays, interaction, caustics and readouts real.

---

## 6. The world (when the simulation lands)

Units are metres. Bench top is `y = 0`.

| Element | Spec |
|---|---|
| Bench | 2.4 × 1.4, dark anodised surface, faint grid, fixed |
| Screen | 1.2 wide × 0.38 tall, at `z = -0.66`, fixed |
| Source rail | along `x = -1.12`, `z ∈ [-0.55, 0.55]`, brass |
| Beam height | `y = 0.11`, always horizontal |
| Object bounds | `x ∈ [-1.05, 1.05]`, `z ∈ [-0.55, 0.55]` |
| Max specimens | 6 |
| Max glass objects | 3 |

Default camera: `(1.80, 1.08, 2.00)`, target `(-0.03, 0.16, -0.06)`, fov 32.
Orbit and zoom only; no pan.

---

## 7. Specimens

| Specimen | Controls | Ranges |
|---|---|---|
| Sphere | size, material, IOR, dispersion | radius `0.045–0.14` |
| Prism | size, rotation, material, IOR, dispersion | side `0.14–0.32`, rotation `0–360°` |
| Mirror | size, rotation | width `0.14–0.40`, rotation `0–360°` |

Prism height is fixed at `0.22`. Mirror height is fixed at `0.22`. Sphere centre
sits at `y = radius`.

Materials: Glass `1.52`, Water `1.33`, Diamond `2.42`, Custom. IOR range
`1.0–2.5`. Dispersion `0–5×`, applied to Cauchy `B` around 589 nm. The Prism
Rainbow preset uses `×4`, labelled as exaggerated.

---

## 8. Light and physics

- Collimated beam, `2–16 mm` diameter; preset uses `12 mm`.
- Angle `−60°…+60°`.
- White: 7 bands at 430, 470, 510, 550, 590, 630, 670 nm. Mono: one wavelength,
  `450–650 nm`.
- Real: Snell, Fresnel (Schlick), TIR, Cauchy, Beer–Lambert, photon caustics.
- Approximated: Three.js transmission is a look, not the simulation; 7 bands,
  not continuous; no diffraction/polarization/interference; planar receivers
  only; ideal double-sided mirror.

---

## 9. Presets

**01 — Prism Rainbow.** 12 mm white beam, prism at `20°`, dispersion `×4`,
rainbow across the screen. Caption: “White light is seven colours sharing a
path. Glass bends each one differently.”

**02 — Ball Lens.** Beam centred on a glass sphere, caustic on the bench.
Caption: “A glass sphere is a lens. Parallel rays meet at 1.5R from its centre.”

**03 — Blank Bench.** Empty bench, dim source, add-a-specimen state.

---

## 10. Feedback and edge cases

- Hover: ink border, cursor changes.
- Selected: ink-filled tile + red dot.
- Solver: busy pulse for ~650 ms after a control change.
- Max 6: add tiles disable, tooltip `BENCH FULL`.
- Empty: hint `ADD A SPECIMEN`; beam still hits the screen.
- Share: `LINK COPIED` or a fallback toast.
- Export: dialog opens even if the solver is busy.
- Unknown route: home.
- No WebGL2: a dark panel explaining the requirement.
- Worker failure: caustics off, one-line note.
- Resize: chamber and panels reflow; no horizontal scroll.
- Reduced motion: no page fade, no beam draw, no pulse.

---

## 11. Keyboard

| Key | Action |
|---|---|
| `R` | toggle rays |
| `H` | hide/show UI |
| `S` | export |
| `0` | reset camera |
| `Esc` | close overlay / deselect |
| `Delete` | remove selected |
| `Ctrl+Z` | undo (later) |
| `1` / `2` | scene 1 / 2 |
| `?` | help |

Arrow keys nudge the selected specimen (later).

---

## 12. Technical architecture

```
┌──────────────────────────────────────────────────────────────┐
│ React shell — HashRouter, HomePage, ScenePage                │
│ ToastProvider · overlays · inspector · source bar            │
├───────────────────────────┬──────────────────────────────────┤
│ SceneCanvas               │ state/                            │
│ SVG mock now              │ scene, preset, selection          │
│ Three.js later            │ Zustand when the sim lands        │
├───────────────────────────┴──────────────────────────────────┤
│ optics/ — pure TypeScript, no React, no Three.js (later)     │
└──────────────────────────────────────────────────────────────┘
```

- React owns the UI and routing.
- Three.js, when added, lives in one `SceneCanvas` component and is driven by
  state; no react-three-fiber.
- The mockup uses `scene-visual.tsx` with inline SVG.
- Hash routes avoid GitHub Pages 404s.
- The hero is `components/ui/hero.tsx`, based on the 21st.dev component.
- shadcn `Button` is themed, not used raw.

### Project setup

```bash
npm create vite@latest . -- --template react-ts
npm i react-router-dom lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot
npm i -D tailwindcss @tailwindcss/vite
```

- Tailwind 4 via `@tailwindcss/vite`.
- `@` alias to `src`.
- Fonts: Instrument Sans, Newsreader, IBM Plex Mono.
- `base: './'` so the build works at any GitHub Pages subpath.

---

## 13. Routes and GitHub Pages

| Route | Screen |
|---|---|
| `#/` | Home |
| `#/scene?preset=prism` | Prism Rainbow |
| `#/scene?preset=ball` | Ball Lens |
| `#/scene?preset=blank` | Blank Bench |
| `#/scene?s=…` | Shared scene (later) |

- Hash routing: no `404.html`, no server rewrites.
- Vite `base: './'`.
- GitHub Actions: build, upload `dist`, deploy Pages.
- `public/.nojekyll`.
- Repo public, MIT.
- Verify the deployed URL logged out.

---

## 14. Data model

```ts
type PresetId = 'prism' | 'ball' | 'blank';
type Spectrum = 'white' | number;

type Specimen = {
  id: string;
  type: 'sphere' | 'prism' | 'mirror';
  x: number;
  z: number;
  size: number;
  rotation: number;
  material: 'glass' | 'water' | 'diamond' | 'custom';
  ior: number;
  dispersion: number;
};

type Scene = {
  version: 1;
  preset: PresetId | null;
  source: { z: number; angle: number; width: number; spectrum: Spectrum };
  specimens: Specimen[];
  camera: { position: [number, number, number]; target: [number, number, number] };
};
```

The mockup uses a subset: preset, selected specimen, material, IOR, dispersion,
size, rotation, source angle/width/spectrum, rays on/off.

---

## 15. Rendering pipeline (final)

1. Three.js WebGL2, antialias, DPR capped at 1.75, ACES, sRGB.
2. Bench, screen, source, mounts, specimens; warm key, cool rim, low ambient.
3. Ray overlay: `LineSegments2`, core + halo, additive, depth off.
4. Caustics: additive planes on bench and screen from the photon worker.
5. Bloom: threshold 0.9, strength 0.12, radius 0.4.
6. UI overlays are React/DOM, never drawn in WebGL.
7. Resize observed on the chamber element.

The mockup replaces steps 1–5 with one SVG.

---

## 16. Photon worker (final)

- 60k photons full, 12k preview.
- Disk sampling, collimated, random band.
- Fresnel choice, TIR, Beer–Lambert, max 8 bounces.
- Deposit only photons that interacted with glass.
- 512²×3 float buffers per receiver; 3×3 splat; blur; tone map.
- `ImageData` back to the main thread; `CanvasTexture`.
- Stale jobs ignored by id.

---

## 17. Performance

| Metric | Target |
|---|---|
| Frame rate | 55–60 fps on a 2020 laptop |
| Ray retrace | < 8 ms for 28 rays × 7 bands |
| Photon pass | < 250 ms for 60k |
| Initial load | < 2 s on Pages |
| Bundle | < 350 KB gzipped before Three, < 900 KB after |
| Glass objects | max 3 |

If missed: 32 rays, 30k photons, half-res bloom. No GPU backend.

---

## 18. Stages (S)

The whole build is split into 22 small stages, **S0 → S21**. Each stage is a
self-contained slice with a demo and explicit exit criteria. The list starts
from an empty folder and ends at the shipped app.

Estimates are focused agentic-coding time, not elapsed time. They sum to
~29 h; allow ~2 h of buffer. S0–S10 are the approved UI mockup; **S11 is next**.

A stage is complete only when every exit criterion is true, `npm run build`
passes, and the previous stage's demo still works. No stage starts on a red
build.

| S | Stage | Est | Status |
|---|---|---|---|
| S0 | Decisions and spec | 0.25 h | done |
| S1 | Project foundation | 1 h | done |
| S2 | Design system | 1 h | done |
| S3 | Brand plate and icons | 0.75 h | done |
| S4 | Routing and Pages | 0.75 h | done · live URL pending |
| S5 | Homepage hero | 1.5 h | done |
| S6 | Start options and import | 1 h | done |
| S7 | Scene shell | 1 h | done |
| S8 | SVG scene | 1 h | done |
| S9 | Mock interactions | 1.5 h | done |
| S10 | Mockup freeze | 0.5 h | done |
| S11 | Optics A: vectors and primitives | 1.25 h | **next** |
| S12 | Optics B: Snell, Fresnel, TIR | 1.25 h | planned |
| S13 | Optics C: spectrum and prism path | 1.25 h | planned |
| S14 | Three.js stage | 2 h | planned |
| S15 | Real ray overlay | 1.75 h | planned |
| S16 | Real interaction | 2 h | planned |
| S17 | Real presets | 0.75 h | planned |
| S18 | Photon caustics | 3 h | planned |
| S19 | Lab features | 1.5 h | planned |
| S20 | Polish and reliability | 1.5 h | planned |
| S21 | Ship | 1.5 h | planned |

---

### S0 — Decisions and spec · 0.25 h

**Build.** Choose the platform, stack, pages, routes, theme, scope, physics and
stage plan. Write `SPEC.md` and keep `Guidance.md` as the design constraint.

**Exit criteria.**
- The spec answers: what it is, what it is not, how it looks, how light is
  simulated, what ships.
- Platform and stack are locked; no open “maybe React / maybe native” question.
- No app code has been written against an unstable plan.

**Status:** done.

### S1 — Project foundation · 1 h

**Build.** Vite + React + TypeScript, Tailwind 4, the shadcn-style Button,
Newsreader / Instrument Sans / IBM Plex Mono, the `@` alias, package scripts,
`.gitignore`.

**Exit criteria.**
- `npm run dev` opens a dark placeholder page.
- `npm run build` passes with zero TypeScript errors.
- Fonts load; no console errors; `node_modules` and `dist` are ignored.

**Status:** done.

### S2 — Design system · 1 h

**Build.** Dark tokens, type scale, technical grid, grain, buttons, segmented
controls, sliders, readouts, toast, focus ring, reduced-motion rules.

**Exit criteria.**
- The palette is applied through tokens, not scattered hex values.
- Button, segmented, slider and readout look like one instrument.
- Text meets AA contrast; focus is visible; reduced motion removes animation.
- No default shadcn/rounded-card look survives.

**Status:** done.

### S3 — Brand plate and icons · 0.75 h

**Build.** Crop the prism/rainbow plate into a UI badge, favicon ICO, 16/32/192/
512 PNGs, Apple touch icon, maskable icon, manifest and 1200×630 OG card. Put
the badge in the header, scene top bar, eyebrow and footer.

**Exit criteria.**
- ICO contains 16/32/48/64; manifest parses; OG is 1200×630.
- The prism is recognisable at 20 px; the favicon survives 32 px.
- Every asset resolves from the relative `./` build path.
- The conversion is reproducible from `assets/brand/prism-source.png`.

**Status:** done.

### S4 — Routing and Pages · 0.75 h

**Build.** HashRouter with `#/` and `#/scene?preset=…`, unknown-route fallback,
GitHub Actions workflow, `base: './'`, `public/.nojekyll`.

**Exit criteria.**
- `#/`, `#/scene?preset=prism|ball|blank` all load directly.
- An unknown route lands on home.
- A production build uses relative asset paths.
- The workflow deploys `dist`; the live URL loads logged out.

**Status:** code done; live URL pending.

### S5 — Homepage hero · 1.5 h

**Build.** Header, brand badge, static eyebrow, gradient title with one italic
word, subtitle, CTAs, technical grid, dark radial accent, bottom fade and the
fade-in sequence.

**Exit criteria.**
- 1440×900, 1536×730 and 390×844 all hold without clipping or h-scroll.
- The radial accent is centered; no sample picture or text inside it.
- The title reads in five seconds; the CTAs are clearly the next action.
- Reduced motion removes the entrance sequence.

**Status:** done.

### S6 — Start options and import · 1 h

**Build.** `Create new scene` → blank bench; `Import a scene` → link dialog with
validation, inline error, Cancel/backdrop/`Esc`; repeat both in the header;
footer with the brand badge.

**Exit criteria.**
- Create new opens the blank bench and its add-specimen actions.
- A valid preset link opens that scene and shows a toast.
- An invalid link shows an inline error, not a crash.
- Header Import opens the same dialog; no dead “Scenes” nav remains.

**Status:** done.

### S7 — Scene shell · 1 h

**Build.** Scene top bar, specimen rail, dark chamber, inspector, source bar,
fixed technical grid, responsive ordering.

**Exit criteria.**
- Three columns at ≥1024 px; one column below.
- At 1536×730 the inspector fits without a visible scrollbar and the page does
  not scroll vertically.
- At 390×844 the chamber, source bar, inspector and rail stack cleanly.
- No horizontal overflow at any tested width.

**Status:** done.

### S8 — SVG scene · 1 h

**Build.** Prism, ball-lens and blank illustrations with bench, screen, source,
selection ring, white/mono spectrum and beam-width response.

**Exit criteria.**
- All three presets render with the right object and receiver.
- Prism ↔ Ball switch updates the chamber and inspector.
- Rays toggle hides the beam but leaves the spectrum/caustic.
- No text inside the illustration; no clipped subject at 1440 or 390.

**Status:** done.

### S9 — Mock interactions · 1.5 h

**Build.** Material/IOR/dispersion/size/rotation controls, critical-angle
readout, solver timer, source angle/width/spectrum, help sheet, ray readout,
export dialog, share toast, add/remove/clear.

**Exit criteria.**
- Every visible control changes a visible value or state.
- Clicking a ray or the ruler opens the readout; `Esc` closes it.
- Export downloads the mock SVG; Share copies the URL; toasts appear.
- No console errors; every button does something.

**Status:** done.

### S10 — Mockup freeze · 0.5 h

**Build.** Review at 1440/1536/390, remove the scene library and dead files,
fix contrast/overflow, freeze tokens and layout.

**Exit criteria.**
- User approves the mockup.
- No dead buttons, placeholder copy or unused components.
- Build passes; screenshot set exists; the UI tokens are frozen.

**Status:** done.

---

### S11 — Optics A: vectors and primitives · 1.25 h

**Build.** `Vec3`, ray type, closest-hit loop, sphere, plane/rectangle, convex
prism (5 planes), interval clipping, normals.

**Exit criteria.**
- Unit tests for sphere, plane, rectangle, prism entry/exit and closest hit.
- Hit points and outward normals are correct in hand-checked cases.
- No Three.js, React or DOM imports in `src/optics/`.
- `npm test` passes.

**Status:** next.

### S12 — Optics B: Snell, Fresnel, TIR · 1.25 h

**Build.** Vector Snell, Schlick Fresnel, total internal reflection, medium
tracking, epsilon offsets, reflection branches.

**Exit criteria.**
- Normal incidence continues straight.
- Air → glass at 30° refracts to ≈19.2°.
- Glass → air at 45° totally internally reflects.
- Critical angle glass → air = 41.1° ± 0.2.
- Fresnel `R + T = 1`; no NaN directions.

### S13 — Optics C: spectrum and prism path · 1.25 h

**Build.** Seven bands (430–670 nm), Cauchy `n(λ)`, wavelength → RGB, full
source → prism → screen trace, headless debug printout.

**Exit criteria.**
- The prism produces seven exit rays with distinct angles.
- Blue bends more than red; all seven land on the screen.
- A debug trace prints source, entry, inside, exit and receiver points.
- Tests cover the trace and white balance.

### S14 — Three.js stage · 2 h

**Build.** WebGL renderer, camera/orbit, dark room, bench, screen, source,
prism/sphere/mirror meshes, lights, environment, bloom, resize.

**Exit criteria.**
- The composed scene runs at 55–60 fps on the target laptop.
- Orbit/zoom feel like the mockup framing; glass and brass read correctly.
- DPR is capped; resize works; no console errors.
- The SVG is no longer the scene renderer.

### S15 — Real ray overlay · 1.75 h

**Build.** Trace the visible fan with the optics core; draw a `LineSegments2`
core and halo; spectral colors; rays toggle; beam draw-on.

**Exit criteria.**
- A white beam splits into a readable seven-color fan on the screen.
- `R` toggles the overlay; the scene and receiver remain.
- Rays stay readable inside glass; no z-fighting; 55–60 fps.

### S16 — Real interaction · 2 h

**Build.** Scene store, select/hover, drag on the bench plane, add/remove,
rotate/resize, bench bounds, no-overlap, live retrace.

**Exit criteria.**
- Up to six specimens can be placed; the seventh is blocked.
- Dragging clamps to the bench and rejects overlap.
- Rays retrace live; inspector stays in sync.
- Delete, clear and reset leave a coherent scene.

### S17 — Real presets · 0.75 h

**Build.** Exact Prism Rainbow, Ball Lens and Blank scenes; reset preset;
preset switch; captions.

**Exit criteria.**
- Each preset loads the correct specimen, source, camera and caption.
- Reset restores the preset exactly.
- Blank → add prism/sphere works; switching presets leaves no stale state.

### S18 — Photon caustics · 3 h

**Build.** Worker, photon emission, Fresnel/TIR/absorption, splat, blur, bench
and screen textures, preview/full passes, solver status.

**Exit criteria.**
- The sphere makes a visible caustic on the bench.
- The prism paints a spectrum band on the screen.
- The UI stays responsive; caustics refresh after a drag.
- Stale jobs are ignored; worker failure degrades gracefully.

### S19 — Lab features · 1.5 h

**Build.** Ray measurement card from real trace metadata, share URL serialization
and PNG export.

**Exit criteria.**
- Clicking a ray shows correct incidence, refraction, critical angle and TIR.
- A share link round-trips the scene in an incognito window.
- PNG export is 2× and excludes the UI.
- No dead or fake values remain.

### S20 — Polish and reliability · 1.5 h

**Build.** Performance pass, accessibility, responsive pass, WebGL2 check,
reduced motion, contrast, missing-state handling, dead-code deletion.

**Exit criteria.**
- 55–60 fps at 1280×800 and 1440×900.
- 390×844 is usable; no horizontal scroll.
- Keyboard focus, labels and `prefers-reduced-motion` work.
- WebGL2 failure and worker failure show readable fallbacks.
- No unused files, deps or commented experiments.

### S21 — Ship · 1.5 h

**Build.** Public repo, Pages deploy, README written by you, devlog, screenshots,
demo video, browser matrix.

**Exit criteria.**
- The Pages URL loads logged out, including favicon, manifest and fonts.
- The repo has incremental history and a real devlog.
- README explains what it is, how to run it, how it works, and one failure.
- 45–60 s demo video exists.
- Every definition-of-done box in §22 is checked.

---

## 19. Build order and gates

S0 → S21 in order. Three gates are non-negotiable:

1. **S10 before S11.** Freeze the UI before the physics.
2. **S13 before S15.** Prove Snell/Fresnel/TIR before replacing the SVG.
3. **S15 before S18.** A caustic without readable rays is a blurry texture.

S16 and S18 must land before S19: the measurement card needs real trace
metadata, and the export needs real receivers. S21 only after S20.

If time is short, cut the mirror tile (S14/S16) and the share/PNG parts of S19;
do not cut S10, S13 or the Pages deploy.

---

## 20. Test plan

### Mockup

- Home → Create new scene → blank bench.
- Home → Import → valid preset link → scene; invalid link → inline error.
- Header Import opens the dialog; `Esc` closes it.
- Back → home.
- Prism ↔ Ball switch.
- Blank → add prism/sphere.
- All sliders update values.
- Rays toggle / `R`.
- Click each ray opens the readout; Esc closes.
- Help opens/closes; Esc.
- Share copies and toasts.
- Export dialog opens and downloads a mock SVG.
- Remove → blank.
- 1440×900, 1280×800, 390×844: no horizontal scroll, no clipped controls.
- Reduced motion: no animation.

### Optics (later)

- Snell normal incidence.
- Air → glass 30° → 19.2°.
- TIR at 45° glass → air.
- Critical angle 41.1° ±0.2.
- Fresnel R + T = 1.
- Sphere intersection.
- Prism half-space clipping.
- Cauchy n(430) > n(670).
- 7-band white balance.
- Full source → prism → screen trace.

---

## 21. Risks and cuts

| Risk | Mitigation |
|---|---|
| Homepage scope creep | Hero + two start actions + footer, nothing else |
| shadcn theming fights the design | Theme tokens first; few components |
| Hash routing edge cases | Two routes, one parser, test direct links |
| GitHub Pages base path | `base: './'`, test the deployed subpath |
| Mockup mistaken for the app | Banner in README: no simulation yet |
| 30 h slips | Cut mirror, share, PNG, then caustics |
| Agent slop | One component at a time, review every file, no default shadcn look |

Cut order: mirror → share link → PNG export → second preset. Never cut the
homepage, the scene chamber, or the deploy.

---

## 22. Definition of done

### Mockup

- [x] Home hero reads in 5 seconds.
- [x] Create new and Import work, including the invalid-link error.
- [x] Scene page looks like the same product as the home page.
- [x] Every visible button does something.
- [x] No dead links, placeholder copy, or console errors.
- [x] 1440×900, 1280×800 and 390×844 hold.
- [x] `npm run build` passes.
- [ ] GitHub Pages URL loads logged out. (pending deploy)

### Final app

- [ ] Real prism rainbow, sphere caustic, ray readout.
- [ ] Add/drag/rotate/resize specimens.
- [ ] Both presets and blank bench.
- [ ] PNG export and share link.
- [ ] Chrome, Firefox, Safari.
- [ ] README, demo video, devlog, daily commits.

---

## 23. Post-v1

Third preset (periscope), normals overlay, screen-distance slider, quality
toggle, custom glass tint, biconvex lens, frosted glass, beam splitter, animation
timeline, GIF export, mobile-first editor, GPU photons.

---

## 24. Authorship

- You review and understand every file.
- Commit in small steps; keep a devlog with screenshots.
- Write the README yourself, including one thing that broke.
- Use AI to explain, review and suggest — not to author the whole app.
- Log hours in Hackatime from the first session.
