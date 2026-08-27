# ZoomBackgroundGenerator

Use this tool to generate a personalized virtual background for use in classroom Zoom sessions.
The backgrounds are designed to make your name visible even in Zoom's grid view.

This tool was developed by the University of Virginia Darden School of Business and is adapted by
Yale School of Management with permission.

## Development

```sh
npm install
npm run dev      # http://localhost:3000 with hot reload
npm test         # run the test suite
npm run build    # production build into dist/
```

## Docker

Two images are provided. Both build the app from source and serve the result with nginx.

| File              | Serves the app at                | Used for                |
| ----------------- | -------------------------------- | ----------------------- |
| `Dockerfile`      | `/`                              | local / standalone      |
| `Dockerfile.prod` | `/zoombackgroundgenerator/`      | production (sub-path)   |

**Build:**

```sh
docker build -t zoombackgroundgenerator:latest .
```

**Run:**

```sh
docker run -d -p 8080:80 --name zoombackgroundgenerator zoombackgroundgenerator:latest
```

The app runs at http://localhost:8080

**Stop:**

```sh
docker stop zoombackgroundgenerator
```

Or use compose, which can run either variant:

```sh
docker compose up --build                  # http://localhost:8080/
docker compose --profile prod up --build   # http://localhost:8081/zoombackgroundgenerator/
```

The sub-path is set by vite's `base`; override it with the `VITE_BASE` environment variable at
build time (`Dockerfile` sets `VITE_BASE=/`).

## Pre-filling the form

Name fields can be supplied in the query string, so a link can open the form ready to save:

```
?first=Ada&last=Lovelace&pronouns=she/her&cohort=%230033AB
```

`background` and `logo` are also accepted. Unrecognised values are ignored.

## Layout

```
index.html            vite entry point
public/assets/        background photos and logos
src/
  App.jsx             form state, repaint and save
  components/         form and preview
  hooks/              asset and webfont loading
  lib/
    options.js        the dropdown contents and per-background render settings
    draw.js           all canvas rendering (pure; no DOM beyond the context)
    formRules.js      the EMBA backgrounds lock the logo/cohort controls
    urlParams.js      query-string pre-fill
    canvasExport.js   preview data URL and file download
    images.js         asset URLs and loading
  fonts/              NeueHaasUnicaPro webfont
docker/               nginx configs for the two images
test/
  legacy/legacyDraw.js  the original draw() kept verbatim as a test oracle
```

## Tests

```sh
npm test
```

The suite's centrepiece is a characterization test: `test/legacy/legacyDraw.js` is the original
inline `draw()` from the pre-React page, copied verbatim. `test/draw.test.js` runs it and the new
renderer against a recording canvas and asserts they emit the identical sequence of drawing
operations for every background x cohort x logo x aspect-ratio combination, plus a set of
edge-case name strings. If a change alters what lands on the canvas, those tests fail.
