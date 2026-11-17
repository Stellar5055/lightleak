# UI mockup — not the app

This is the clickable interface mockup for Lightleak. **No light is simulated.**

Live mockup: **https://stellar5055.github.io/lightleak/**

The scene is an SVG illustration. There is no Three.js, no ray tracer and no
photon worker in this build. The numbers are mock values. Every button, page,
slider and overlay works so the UI can be reviewed before the simulation is
written.

## Run

```bash
npm install
npm run dev
```

Open the local URL. Routes are hash-based:

- `#/` — home
- `#/scene?preset=prism`
- `#/scene?preset=ball`
- `#/scene?preset=blank`

## What works

- Home → Create new scene (blank) or Import a scene (paste a link).
- Import validates preset links, opens the scene and shows a toast; invalid
  links get an inline error.
- Prism / Ball / Blank scenes.
- Specimen selection, material switch, sliders, readouts.
- Rays toggle (`R`), help (`?`), ray readout, share, export SVG, toasts.
- Clear bench, add specimen, remove specimen.
- Mobile layout.
- GitHub Pages workflow is in `.github/workflows/deploy.yml`.

## What is fake

- The chamber is SVG, not a Three.js canvas.
- No Snell, Fresnel, TIR, dispersion or caustics.
- The solver LED is a 650 ms UI timer.
- The export downloads the mock SVG, not a rendered plate.
- Import only understands preset links in this build. Full `?s=` scene links
  arrive with the simulation.

## Brand

- Source plate: `assets/brand/prism-source.png`.
- Crop / convert: `python scripts/brand_assets.py` (Pillow).
- Generated: `public/favicon.ico`, `favicon-16/32/192/512.png`,
  `apple-touch-icon.png`, `favicon-maskable-512.png`, `site.webmanifest`,
  `public/og-image.jpg`, and `src/assets/brand-mark.png`.
- The UI badge is used in the home header, scene top bar, eyebrow pill and
  footer. The favicon uses a slightly wider crop so the rainbow survives at
  32 px.

## Next

S11–S13 in `SPEC.md`: the optics core. Nothing is simulated until those stages
land.
