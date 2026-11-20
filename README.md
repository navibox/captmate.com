# captmate.com

Website for the CaptMate Android app, served by GitHub Pages at https://captmate.com

- `index.html` - the whole page (English / 中文, switch at the top right; text for each language sits in `lang="en"` / `lang="zh"` elements)
- `media/promo.mp4` - the promo film (rendered from navibox/CaptMate `promo2/`)
- `media/clip-*.mp4` - short muted loops cut from the film for the feature sections

Edit and push to `main` to update the site.

## Hosting
The site is served by Cloudflare (Worker `captmate-site` with the files as static assets), deployed by
`.github/workflows/deploy.yml` on every push to `main` (needs the repository secret `CLOUDFLARE_API_TOKEN`).
`worker/index.js` counts APK downloads (D1 table `downloads`) and serves the file named in `download/latest.txt`.
To release a new APK: add `download/CaptMate-<version>.apk`, put its name in `download/latest.txt`,
update the version text in `index.html`, and keep a copy as `download/CaptMate-beta.apk` (GitHub Pages fallback).
