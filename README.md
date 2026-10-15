# Tim Kattenbusch — Portfolio

Static portfolio for Tim Kattenbusch, freelance digital UI/UX designer. The page is in German and built as a horizontal story on desktop, with a stacked layout on small screens.

The interaction model — pinned horizontal scroll, chapter panels, the “Die Arbeit” scale pause, line reveals, hover previews, and the page dissolve — is an original implementation. Copy, photographs, and the monogram belong to this site. Display type is [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif); interface type is [Outfit](https://fonts.google.com/specimen/Outfit). Both are open fonts.

Project images are the ones published on [hellotim.work](http://www.hellotim.work). The portrait frame is a labeled placeholder.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # writes dist/
npm run preview  # serves dist/
```

Node 22 is the version used in CI.

## GitHub Pages

`.github/workflows/pages.yml` builds on every push to `main` and deploys with GitHub Pages. The workflow sets `BASE_PATH` to `/<repository>/` for project sites and to `/` for a user or organization site named `<owner>.github.io`.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

To build locally with the same prefix:

```bash
BASE_PATH=/your-repo/ npm run build
```

## Content

All copy, projects, navigation, and the home-page order live in `src/data/content.js`.

- `locale` is `"de"`. Add another catalog next to `de` and point `locale` at it.
- `story` is the home sequence. Entries with `enabled: false` stay in the file and are not rendered.
- Fotografie and Meeresschutz are already stubbed as `type: "feature"`. Set `enabled: true` and replace the placeholder text to show them. A new layout type needs a branch in `src/render/markup.js` (`renderPanel`).
- Project galleries are files in `public/media/<project>/`.

`npm run dev` and `npm run build` regenerate the HTML pages from that data.
