# LoanLens – Bank Loan Analytics

Interactive dashboard (Overview · Portfolio · Risk analysis) built from 38,576 loans.
Static site: Tailwind CSS + GSAP + Motion, pre-aggregated data, no server needed.

## Project layout
| Path | Purpose |
|---|---|
| `src/` | Source: `index.html`, `app.js` (all dashboard logic), `styles.css` (Tailwind), `data.js` (generated numbers) |
| `scripts/build.mjs` | Production build -> `dist/` (compiles Tailwind, bundles + minifies JS, hashes file names) |
| `scripts/serve.mjs` | Local preview server that sends the same headers as Render |
| `scripts/build_data.py` | Rebuilds `src/data.js` from `data/Financial_loan_data.xlsx` (only when the data changes) |
| `render.yaml` | Render Blueprint: build command, publish folder, security + cache headers |
| `public/` | `404.html`, `favicon.svg`, `robots.txt` (copied into `dist/`) |

## Run locally
```bash
npm ci            # install exact versions from package-lock.json
npm run dev       # build + serve at http://localhost:8080
```

## Update the data
```bash
pip install pandas openpyxl
python scripts/build_data.py     # rewrites src/data.js
git add -A && git commit -m "Update data" && git push   # Render redeploys automatically
```

## Deploy on Render
See the step-by-step guide: connect the GitHub repo in Render as a **Blueprint** (uses `render.yaml`)
or as a **Static Site** with Build Command `npm ci && npm run build` and Publish Directory `dist`.
