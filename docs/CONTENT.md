# Inhalte bearbeiten

Alle sichtbaren Texte, Projekte und die Reihenfolge der Startseite stehen in [`src/data/content.js`](../src/data/content.js). Die Sprache der Seite ist Deutsch (`locale` ist `"de"`). Nach einer Änderung `npm run dev` oder `npm run build` ausführen. Die HTML-Dateien werden daraus neu geschrieben.

## Katalog

`de` ist der einzige Katalog. Ein weiteres Objekt neben `de` in `catalogs` anlegen und `locale` darauf zeigen, wenn eine zweite Sprache dazukommen soll. `getContent()` fällt auf `de` zurück, wenn die gewählte Sprache fehlt.

Wichtige Felder:

| Feld | Wirkung |
| --- | --- |
| `meta` | Seitentitel und Beschreibung |
| `person` | Name, Rolle, `contact@hellotim.work`, Ort, Adresse, Zeitzone `Europe/Berlin` |
| `nav` | Menü. `href` ist ein Pfad (`/`, `/about/`, `/works/`) oder ein Anker (`/#kontakt`) |
| `socials` | Links in Menü und Kontakt |
| `hero`, `about`, `work`, `services`, `clients`, `contact` | Texte der festen Abschnitte |
| `projects` | Projektliste, Reihenfolge ist die Anzeigereihenfolge |
| `story` | Abschnitte der Startseite und ob sie gerendert werden |
| `imprint` | Impressum |

Themenfarben liegen in `themes` (`hero`, `paper`, `sand`, `ink`, `footer`). `page` ist die Farbe der Seitenüberblendung.

## Projekt hinzufügen

1. Bilder nach `public/media/<ordner>/` legen. Dateinamen `01.jpg`, `02.jpg`, … Breite und Höhe im Helfer `shots()` sind 1920×1080.
2. In `projects` ein Objekt ergänzen:

```js
{
  slug: "neuer-titel",
  title: "Neuer Titel",
  details: ["UX/UI Design", "Website"],
  transition: "#faf9f6",
  images: shots("neuer-titel", "Neuer Titel", 4),
}
```

`slug` wird zur URL `/works/neuer-titel/`. `details` sind die Zeilen unter dem Titel. `shots(ordner, titel, anzahl)` baut Alt-Texte und Pfade. `transition` ist die Farbe beim Seitenwechsel.

Das Projekt erscheint in der Startlisten, unter `/works/` und als eigene Galerie. Das nächste Projekt in der Liste ist der Link „Nächstes Projekt“.

Bilder, die schon auf hellotim.work liegen, können weiterverwendet werden. Neue Bilder gehören ins Repo unter `public/media/`. Es gibt keinen Upload zur Laufzeit.

## Fotografie und Meeresschutz

Beide Abschnitte sind in `story` vorbereitet und ausgeschaltet:

```js
{ id: "photography", type: "feature", enabled: false, /* … */ }
{ id: "ocean", type: "feature", enabled: false, /* … */ }
```

Sichtbar machen: `enabled` auf `true` setzen und `chapter`, `kicker`, `title`, `text` ersetzen. `theme` verweist auf einen Schlüssel in `themes` (`ink` oder `hero` sind die aktuellen Werte).

`type: "feature"` rendert Kapitel, Kicker, Titel und einen Absatz. Bilder hat dieses Panel noch nicht. Dafür einen Zweig in `renderPanel` in [`src/render/markup.js`](../src/render/markup.js) ergänzen.

`enabled: false` lässt den Eintrag in der Datei und nimmt ihn aus der Startseite. Die Reihenfolge in `story` ist die Reihenfolge auf der Startseite. Feste Typen: `hero`, `about`, `work-title`, `work`, `services`, `clients`, `contact`, `feature`. Ein unbekannter `type` wird übersprungen.

## Texte der festen Abschnitte

- Hero: `hero.name` ist ein Array mit einer Zeile pro Eintrag (`["Tim", "Kattenbusch"]`). `slideLabel` und `tagline` ebenso.
- Über mich: `about.intro` auf der Startseite, `about.topics` auf `/about/`.
- Leistungen: `services.items` mit `no`, `title`, `text`, `image`, `alt`. `image` ist ein Pfad unter `media/…` ohne führenden Schrägstrich.
- Stationen: `clients.items`. Der Eintrag `clients.more` („Und weitere“) bleibt sichtbar, aber zurückgenommen.
- Kontakt: `contact.heading`, `contact.tagline`. Die E-Mail kommt aus `person.email`. Der Anker ist `contact.id` (`kontakt`), das Menü verlinkt `/#kontakt`.
- Impressum: `imprint.blocks`. Die öffentliche Adresse und die Steuerangaben stammen von der alten Seite.

Das Porträt ist kein Foto. Der Rahmen zeigt `about.portraitLabel` („Platzhalter — Porträt folgt“). Ein echtes Bild braucht eine Änderung in `src/render/markup.js` (`portrait()`).

## Was nicht von Hand editiert wird

`index.html`, `about/`, `works/`, `impressum/` und `404.html` im Repository-Root entstehen beim Start von Vite. Sie stehen in `.gitignore`. Inhalt nur in `src/data/content.js` ändern.
