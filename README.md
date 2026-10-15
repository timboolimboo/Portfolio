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
npm run build     # writes dist/
npm run preview   # serves dist/ on 127.0.0.1
```

`dev` and `build` regenerate the HTML from `src/data/content.js`. Those HTML files are gitignored.

## GitHub Pages

This repository is `timboolimboo/Portfolio`. The public site is a project site, so every asset must be prefixed with `/Portfolio/` — the repository name, case-sensitive.

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every push to `main` and on manual dispatch. It installs with `npm ci`, builds, and deploys `dist/` with the official Pages actions. The workflow sets:

```text
BASE_PATH=/Portfolio/
```

for this repo. A repository named `<owner>.github.io` would be built with `BASE_PATH=/` instead. The value comes from `github.event.repository.name`, so a rename of the GitHub repo changes the prefix automatically.

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
