# Tim Kattenbusch — Portfolio

German portfolio for Tim Kattenbusch, freelance digital UI/UX designer. Desktop is one pinned horizontal story. Smaller screens use the same sections in a vertical stack, with a short vertical pin on „Die Arbeit“.

Deutsches Portfolio für Tim Kattenbusch. Auf dem Desktop läuft die Seite als horizontale Geschichte. Auf kleinen Screens stehen dieselben Abschnitte untereinander.

The motion — horizontal scrub, the „Die Arbeit“ pause, line reveals, hover previews, the menu, and the page dissolve — is original code. Copy and project photographs come from [hellotim.work](http://www.hellotim.work). The portrait is a labeled placeholder. Display type is [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif); interface type is [Outfit](https://fonts.google.com/specimen/Outfit).

Editing copy, projects, and the home order is covered in [docs/CONTENT.md](docs/CONTENT.md). Releases are listed in [CHANGELOG.md](CHANGELOG.md).

## Scripts

Node 22, the same version as CI.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # writes dist/ at the domain root
npm run preview   # serves dist/ on 127.0.0.1
npm start         # serves dist/ for Nixpacks (PORT, otherwise 80)
```

`dev` and `build` regenerate the HTML from `src/data/content.js`. Those HTML files are gitignored.

A build with no environment variables uses Vite base `/`. Asset URLs are `/assets/…` and `/media/…`. Do not set `BASE_PATH` on a server that hosts the site at the domain root.

## Own server (Dokploy, domain root)

Dokploy on brudiscloud should build branch `main` with build type **Dockerfile**. The image is a Node 22 build, then nginx serving `dist/` on port 80. Leave `BASE_PATH` unset. Point the domain at container port 80, with no subpath.

```bash
docker build -t tim-portfolio .
docker run --rm -p 80:80 tim-portfolio
```

If the app is set to **Nixpacks** instead of Dockerfile, [`nixpacks.toml`](nixpacks.toml) runs the same root build and `npm start` ([`scripts/static-server.mjs`](scripts/static-server.mjs)). That process listens on `PORT`, or 80 when `PORT` is unset.

Ein Build ohne Variablen bleibt unter `/`. `BASE_PATH` auf dem eigenen Server nicht setzen.

## GitHub Pages

This repository is `timboolimboo/Portfolio`. Pages is a project site, so that deploy must prefix every asset with `/Portfolio/` — the repository name, case-sensitive. That prefix is set only in [`.github/workflows/pages.yml`](.github/workflows/pages.yml):

```text
BASE_PATH=/Portfolio/
```

The workflow runs on every push to `main` and on manual dispatch. It installs with `npm ci`, builds, and deploys `dist/` with the official Pages actions. A repository named `<owner>.github.io` would be built with `BASE_PATH=/` instead. The value comes from `github.event.repository.name`, so a rename of the GitHub repo changes the prefix automatically.

Live URL, after Pages is set to GitHub Actions and a `main` deploy has succeeded:

```text
https://timboolimboo.github.io/Portfolio/
```

In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Build locally with the same prefix:

```bash
BASE_PATH=/Portfolio/ npm run build
npm run preview
```

Open `http://127.0.0.1:4173/Portfolio/`.

## Structure

```text
src/data/content.js     text, projects, navigation, home order
src/render/markup.js    HTML for each page and panel
src/render/write.js     writes the HTML when Vite starts or builds
src/main.js             stylesheet + boot
src/boot.js             wires scroll, menu, intro, reveals
src/motion/             GSAP and Lenis
src/styles/main.css
public/media/<folder>/  project JPEGs
public/favicon.svg
Dockerfile              Node build, then nginx on port 80
nginx.conf
nixpacks.toml           same root build when Docker is not selected
scripts/static-server.mjs
.github/workflows/pages.yml
```

Generated pages (`index.html`, `about/`, `works/`, `impressum/`, `404.html`) are created on each dev server start and build. Edit `src/data/content.js`, not those files.

## Layout

| Viewport | Behavior |
| --- | --- |
| ≥ 768px | Left rail, horizontal pinned story, work-list hover preview |
| < 768px | Top bar, stacked sections, „Die Arbeit“ pinned vertically |
| Tablet portrait | Rotate notice between 768px and 1024px |

Home sections, in order: hero, about, Die Arbeit, selected work, services, clients, contact. Fotografie and Meeresschutz are in the data file and stay hidden until enabled. See [docs/CONTENT.md](docs/CONTENT.md).
