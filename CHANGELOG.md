# Changelog

## 2026-10-15

- Portfolio für Tim Kattenbusch: deutsche Startseite mit horizontalem Scroll auf Desktop und gestapeltem Layout auf kleinen Screens.
- Inhalte aus hellotim.work: Promiflash, BMW M Experience, Passpoints, Frames, Medivital, Kontakt `contact@hellotim.work`, Impressum.
- Projektdaten in `src/data/content.js`. Fotografie und Meeresschutz sind angelegt und aus (`enabled: false`).
- GitHub-Actions-Workflow für GitHub Pages. `BASE_PATH` ist `/Portfolio/` für dieses Repository.
- Zeilen-Animationen enden sichtbar: GSAP übernimmt die Transform, der Vorab-Versatz aus dem CSS bleibt nicht stehen.
- Dokumentation: README, `docs/CONTENT.md`, dieses Changelog.
- Eigener Server (Dokploy): Build ohne `BASE_PATH` bleibt bei `/`. `BASE_PATH=/Portfolio/` setzt nur der GitHub-Pages-Workflow. Dockerfile (nginx, Port 80) und Nixpacks-Start liegen im Repo.
