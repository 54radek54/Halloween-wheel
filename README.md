# Fright Night Wheel 🎃

A 3D, futuristic Halloween movie-picker wheel (Three.js, single HTML file) plus a GitHub Actions workflow that can draw a movie for you.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The wheel app. Loads `movies.json` automatically when hosted. |
| `movies.json` | Your movie list. Edit this file. |
| `watched.json` | Movies already picked (filled by the workflow). |
| `scripts/pick-movie.js` | Random pick used by the workflow. |
| `.github/workflows/pick-movie.yml` | Manual draw from the Actions tab. |
| `.github/workflows/deploy-pages.yml` | Publishes the wheel to GitHub Pages. |

## Setup

1. Create a new GitHub repository and push these files to the `main` branch.
2. **Settings → Pages → Source: GitHub Actions.**
3. **Settings → Actions → General → Workflow permissions: Read and write permissions.**
4. Your wheel goes live at `https://<user>.github.io/<repo>/`.

## movies.json format

```json
{
  "title": "Halloween Movie Night",
  "movies": [
    { "title": "Halloween", "year": 1978, "genre": "Slasher", "note": "Optional tagline." }
  ]
}
```

Only `title` is required. A plain array of strings also works.

## Draw with GitHub Actions

**Actions → Pick Halloween movie → Run workflow.** The result appears in the run summary.
Tick `remove_picked` to move the movie into `watched.json` and commit the change (the site redeploys automatically).

## Run locally

```bash
npx serve .
```

Opening `index.html` directly also works; use the **Load movies.json** button (or drag the file in) because browsers block `fetch` on `file://`.
