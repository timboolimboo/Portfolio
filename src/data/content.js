/**
 * Portfolio content — German by default, structured so another locale
 * can be added as a sibling catalog and selected with `locale`.
 *
 * The home page is a horizontal story. Order and visibility live in
 * `story`. To add Fotografie or Meeresschutz later, set `enabled: true`
 * on that entry and replace the placeholder copy. `type: "feature"`
 * already has a panel renderer; a brand-new layout needs a branch in
 * src/render/markup.js (`renderPanel`).
 *
 * Project galleries use images published on http://www.hellotim.work .
 */

export const locale = "de";

const themes = {
  hero: { bg: "transparent", text: "#f3eee8", border: "#5a524d", page: "#262220" },
  paper: { bg: "#faf9f6", text: "#2e2b28", border: "#b8b3ac", page: "#faf9f6" },
  sand: { bg: "#edeae6", text: "#2e2b28", border: "#b8b3ac", page: "#edeae6" },
  ink: { bg: "#2e2b28", text: "#faf9f6", border: "#5a524d", page: "#2e2b28" },
  footer: { bg: "#1f1d1b", text: "#cccccc", border: "#5a524d", page: "#1f1d1b" },
};

function shots(folder, title, count) {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    return {
      src: `media/${folder}/${String(n).padStart(2, "0")}.jpg`,
      w: 1920,
      h: 1080,
      alt: `${title} — Bild ${n} von ${count}`,
    };
  });
}

const de = {
  lang: "de",
  localeLabel: "Deutsch",
  themes,
  meta: {
    title: "Tim Kattenbusch — Digital UI/UX Designer",
    description:
      "Tim Kattenbusch ist freiberuflicher Digital UI/UX Designer, spezialisiert auf UX/UI, Digital Design und Konzeption.",
    name: "Tim Kattenbusch",
  },
  person: {
    name: "Tim Kattenbusch",
    givenName: "Tim",
    familyName: "Kattenbusch",
    role: "Freelance Digital UI/UX Designer",
    email: "contact@hellotim.work",
    place: "Hamm, Deutschland",
    timeZone: "Europe/Berlin",
    address: {
      street: "Am Kirchgraben 23",
      postalCode: "59077",
      city: "Hamm",
      country: "Deutschland",
    },
  },
  nav: [
    { id: "home", label: "Start", href: "/" },
    { id: "about", label: "Über mich", href: "/about/" },
    { id: "works", label: "Arbeiten", href: "/works/" },
    { id: "contact", label: "Kontakt", href: "/#kontakt" },
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com/hellotimk" },
    { label: "Dribbble", href: "https://dribbble.com/helloTim" },
    { label: "Xing", href: "https://www.xing.com/profile/Tim_Kattenbusch" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tim-kattenbusch-107b5a122" },
  ],
  rail: {
    edition: "Folio — Ausgabe",
    year: "© 2026",
  },
  hero: {
    slideLabel: ["Digital", "Design"],
    name: ["Tim", "Kattenbusch"],
    tagline: [
      "Freiberuflicher Digital UI/UX Designer —",
      "spezialisiert auf UX/UI, digitales Design und Konzeption.",
    ],
    open: ["Offen für", "Zusammenarbeit"],
    scroll: "Scroll",
  },
  about: {
    chapter: "Kapitel I",
    kicker: "Kurz vorgestellt",
    intro:
      "Ich bin Tim Kattenbusch, ein freiberuflicher Designer spezialisiert auf UX/UI, Digital Design und Konzeption.",
    quote: ["„Die digitale Welt", "ist mein Zuhause.“"],
    note: "Bachelor in Computervisualistik & Design.",
    more: "Mehr über mich",
    portraitLabel: "Platzhalter — Porträt folgt",
    pageTitle: "Über mich",
    lead: "Ich bin Tim Kattenbusch, ein freiberuflicher Designer spezialisiert auf UX/UI, Digital Design und Konzeption.",
    topics: [
      {
        title: "Hallo lieber User!",
        text: "Mein Name ist Tim Kattenbusch, ich bin freiberuflicher Designer. Die digitale Welt ist mein Zuhause, aber auch die Bereiche der klassischen Kommunikation ziehen mich immer wieder in ihren Bann.",
      },
      {
        title: "Ich bin auf der Suche nach…",
        text: "Egal ob Kampagne, Website oder App, ich bin ständig auf der Suche nach neuen Projekten und Herausforderungen. Ob im Bereich Digital oder Print ich finde die ideale Lösung — also schreiben Sie mir einfach!",
      },
      {
        title: "Qualifikation und Erfahrung",
        text: "Vor kurzem hab ich meinen Bachelor im Bereich Computervisualistik & Design abgeschlossen. Während eines Praktikums in einer Full-Service Agentur durfte ich für Kunden wie LG, Asus und Trilux arbeiten.",
      },
    ],
  },
  workTitle: {
    before: "Die",
    after: "Arbeit",
    label: "Standbilder aus den Projektarbeiten",
  },
  work: {
    chapter: "Kapitel II",
    kicker: "Ausgewählte Arbeiten",
    all: "Alle Arbeiten",
    pageTitle: "Arbeiten",
    pageLead: "Interface, Konzept und Gestaltung — eine Auswahl freier und studentischer Arbeiten.",
    next: "Nächstes Projekt",
    index: "Alle Arbeiten",
  },
  services: {
    chapter: "Kapitel III",
    kicker: "Was ich mache",
    lead: "Digitale Produkte mit Konzept, Struktur und einem genauen Blick fürs Interface.",
    items: [
      {
        no: "01",
        title: "UX/UI Design",
        text: "Oberflächen für Apps und Websites, geführt von Nutzerfluss, Hierarchie und einer ruhigen Struktur.",
        image: "media/frames/01.jpg",
        alt: "Frames — Interface einer iOS-App",
      },
      {
        no: "02",
        title: "Digital Design",
        text: "Visuelle Gestaltung für digitale Produkte, Kampagnen und Markenauftritte.",
        image: "media/promiflash/01.jpg",
        alt: "Promiflash — Screen der Android- und iOS-App",
      },
      {
        no: "03",
        title: "Konzeption",
        text: "Von der Idee zur Lösung: Inhalt, Nutzerführung und das Format, das dazu passt.",
        image: "media/bmw/01.jpg",
        alt: "BMW M Experience — Konzeptvisual",
      },
      {
        no: "04",
        title: "Print & Packaging",
        text: "Klassische Kommunikation, Webdesign und Produktverpackungen — wenn die Idee über den Screen hinaus soll.",
        image: "media/medivital/01.jpg",
        alt: "Medivital — Verpackung und Webauftritt",
      },
    ],
  },
  clients: {
    chapter: "Kapitel IV",
    kicker: "Ausgewählte Stationen",
    more: "Und weitere",
    note: "Praktikum in einer Full-Service-Agentur und eigene Projektarbeiten.",
    items: [
      { name: "LG", detail: "Praktikum, Full-Service-Agentur" },
      { name: "Asus", detail: "Praktikum, Full-Service-Agentur" },
      { name: "Trilux", detail: "Praktikum, Full-Service-Agentur" },
      { name: "BMW", detail: "Konzept, UX/UI, Projektarbeit" },
      { name: "Promiflash", detail: "Interface Design, App" },
    ],
  },
  contact: {
    id: "kontakt",
    kicker: "Kontakt",
    heading: ["Nächstes", "Kapitel"],
    tagline: "Neue Projekte, Kampagnen, Websites oder Apps.",
    socialLabel: "Sozial",
    imprint: "Impressum",
  },
  tablet: {
    title: "Bitte ins Querformat drehen",
    text: "Auf dem Tablet wirkt die Seite im Querformat am besten.",
  },
  notFound: {
    title: "Diese Seite gibt es nicht.",
    link: "Zurück zum Anfang",
  },
  projects: [
    {
      slug: "promiflash",
      title: "Promiflash",
      details: ["Interface Design", "Android/iOS App"],
      transition: "#faf9f6",
      images: shots("promiflash", "Promiflash", 7),
    },
    {
      slug: "bmw-m-experience",
      title: "BMW M Experience",
      details: ["Konzept", "UX/UI Design", "Projektarbeit"],
      transition: "#faf9f6",
      images: shots("bmw", "BMW M Experience", 7),
    },
    {
      slug: "passpoints",
      title: "Passpoints",
      details: ["UX/UI Design", "Website"],
      transition: "#faf9f6",
      images: shots("passpoints", "Passpoints", 7),
    },
    {
      slug: "frames",
      title: "Frames",
      details: ["UI Design/Branding", "iOS App"],
      transition: "#faf9f6",
      images: shots("frames", "Frames", 6),
    },
    {
      slug: "medivital",
      title: "Medivital",
      details: ["Webdesign/Packaging", "Website/Produktverpackungen"],
      transition: "#faf9f6",
      images: shots("medivital", "Medivital", 6),
    },
  ],
  /**
   * Home story. `enabled: false` keeps an entry in the file without rendering it.
   * Supported types: hero, about, work-title, work, services, clients, contact, feature.
   */
  story: [
    { id: "hero", type: "hero", enabled: true },
    { id: "about", type: "about", enabled: true },
    { id: "work-title", type: "work-title", enabled: true },
    { id: "work", type: "work", enabled: true },
    { id: "services", type: "services", enabled: true },
    { id: "clients", type: "clients", enabled: true },
    { id: "contact", type: "contact", enabled: true },
    {
      id: "photography",
      type: "feature",
      enabled: false,
      chapter: "Kapitel V",
      kicker: "Fotografie",
      title: "Fotografie",
      text: "Abschnitt vorbereitet. Text und Bilder hier ergänzen und enabled auf true setzen.",
      theme: "ink",
    },
    {
      id: "ocean",
      type: "feature",
      enabled: false,
      chapter: "Kapitel VI",
      kicker: "Meeresschutz",
      title: "Meeresschutz",
      text: "Abschnitt vorbereitet. Text und Bilder hier ergänzen und enabled auf true setzen.",
      theme: "hero",
    },
  ],
  imprint: {
    title: "Impressum",
    intro: "Angaben gemäß § 5 TMG",
    blocks: [
      {
        heading: "Kontakt",
        paragraphs: [
          "Tim Kattenbusch",
          "Am Kirchgraben 23",
          "59077 Hamm",
          "Tel: +49 (0) 157 89177374",
          "E-Mail: info@hellotim.work",
        ],
      },
      {
        heading: "Steuer",
        paragraphs: ["Steuer-Nummer: DE 322 / 5140 / 3336", "USt-IdNr. DE93183507466"],
      },
      {
        heading: "Haftung für Inhalte",
        paragraphs: [
          "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.",
        ],
      },
      {
        heading: "Haftung für Links",
        paragraphs: [
          "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
        ],
      },
      {
        heading: "Urheberrechte",
        paragraphs: [
          "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.",
        ],
      },
      {
        heading: "Datenschutz",
        paragraphs: [
          "Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.",
          "Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.",
          "Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.",
        ],
      },
    ],
  },
};

const catalogs = { de };

export function getContent(lang = locale) {
  return catalogs[lang] || catalogs.de;
}

export function projectPath(slug) {
  return `/works/${slug}/`;
}
