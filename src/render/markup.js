import { getContent, projectPath } from "../data/content.js";

export function normalizeBase(input) {
  let base = input || "/";
  if (!base.startsWith("/")) base = `/${base}`;
  if (!base.endsWith("/")) base = `${base}/`;
  return base;
}

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}

function href(base, path) {
  if (!path || path === "/") return base;
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const clean = (hashIndex >= 0 ? path.slice(0, hashIndex) : path).replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return `${base}${hash}`;
  return `${base}${clean}/${hash}`;
}

function media(base, path) {
  return `${base}${String(path).replace(/^\//, "")}`;
}

function themeAttrs(theme) {
  return `data-header-bg="${esc(theme.bg)}" data-header-text="${esc(theme.text)}" data-header-border="${esc(theme.border)}"`;
}

function lines(parts) {
  return parts
    .map((part) => `<span class="line-mask"><span class="line" data-line>${esc(part)}</span></span>`)
    .join("");
}

function arrow() {
  return `<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;
}

function jsonLd(content, base) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.person.name,
    jobTitle: content.person.role,
    email: `mailto:${content.person.email}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.person.address.street,
      postalCode: content.person.address.postalCode,
      addressLocality: content.person.address.city,
      addressCountry: "DE",
    },
    sameAs: content.socials.map((item) => item.href),
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function chrome(content, base, current, headerTheme) {
  const home = href(base, "/");
  const nav = content.nav
    .map((item, index) => {
      const active = item.id === current ? ' aria-current="page" data-nav-active="true"' : "";
      const number = String(index + 1).padStart(2, "0");
      const tone = item.id === "works" ? content.themes.sand.page : item.id === "about" ? content.themes.paper.page : content.themes.hero.page;
      return `<a class="nav-link" href="${href(base, item.href)}" data-nav-item data-transition="${tone}"${active}>
        <span class="nav-index">${number}.</span>
        <span class="nav-label"><span class="line-mask"><span class="line" data-line>${esc(item.label)}</span></span></span>
        <span class="nav-active-line" data-nav-active-line></span>
      </a>`;
    })
    .join("");

  const socials = content.socials
    .map(
      (item) =>
        `<a class="link-draw" href="${esc(item.href)}" data-social-link target="_blank" rel="noreferrer">${esc(item.label)}</a>`,
    )
    .join("");

  const bar = headerTheme || content.themes.hero;
  return `<a class="skip" href="#inhalt">Zum Inhalt</a>
  <header class="rail" data-intro-header data-header-bg="${esc(bar.bg)}" data-header-text="${esc(bar.text)}" data-header-border="${esc(bar.border)}" style="--header-bg:${esc(bar.bg)};--header-text:${esc(bar.text)};--header-border:${esc(bar.border)}" aria-label="Kopfzeile">
    <span class="scroll-progress" data-scroll-progress aria-hidden="true"></span>
    <a class="brand brand-mobile" href="${home}" data-transition="${content.themes.hero.page}">${esc(content.person.givenName)}</a>
    <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menü öffnen">
      <span class="menu-bar"></span>
      <span class="menu-bar"></span>
    </button>
    <div class="rail-col">
      <p class="vtext">${esc(content.rail.edition)}</p>
      <a class="monogram" href="${home}" data-transition="${content.themes.hero.page}" aria-label="${esc(content.person.name)}">TK</a>
      <p class="vtext">${esc(content.rail.year)}</p>
    </div>
  </header>
  <dialog class="menu" id="site-menu" aria-label="Navigation">
    <div class="menu-panel" data-menu-panel>
      <button class="menu-close" type="button" data-menu-close>Schließen</button>
      <nav class="menu-nav" aria-label="Hauptnavigation">${nav}</nav>
      <div class="menu-socials">${socials}</div>
    </div>
  </dialog>
  <div class="tablet-notice" role="status">
    <div>
      <p class="tablet-title">${esc(content.tablet.title)}</p>
      <p class="tablet-text">${esc(content.tablet.text)}</p>
    </div>
  </div>
  <canvas id="dissolve" aria-hidden="true"></canvas>`;
}

function portrait() {
  return `<div class="portrait" data-portrait>
    <span class="portrait-overlay" data-portrait-overlay></span>
    <div class="portrait-art" data-portrait-art>
      <span class="portrait-mark" aria-hidden="true">TK</span>
      <span class="portrait-caption">Platzhalter — Porträt folgt</span>
    </div>
  </div>`;
}

function renderHero(content) {
  const theme = content.themes.hero;
  return `<section class="panel hero" data-panel="hero" data-section="hero" ${themeAttrs(theme)}>
    <div class="hero-wash" data-hero-wash></div>
    <div class="hero-slide" data-hero-slide>
      <p class="display-name" data-slide-label>${lines(content.hero.slideLabel)}</p>
    </div>
    <div class="hero-name" data-hero-name>
      <h1 class="display-name" data-name-heading>${lines(content.hero.name)}</h1>
    </div>
    <p class="hero-tagline await" data-reveal-block data-hero-tagline>${lines(content.hero.tagline)}</p>
    <p class="hero-place await" data-reveal-block>
      <span class="line-mask"><span class="line" data-line>${esc(content.person.place)}</span></span>
      <span class="line-mask"><span class="line" data-line><span data-clock>(GMT) --:--</span></span></span>
    </p>
    <p class="hero-open await" data-reveal-block>${lines(content.hero.open)}</p>
    <p class="hero-scroll await" data-reveal-block><span class="line-mask"><span class="line" data-line>${esc(content.hero.scroll)}</span></span></p>
  </section>`;
}

function renderAbout(content, base) {
  return `<section class="panel about" data-panel="about" data-section="about" aria-label="Über mich" ${themeAttrs(content.themes.paper)}>
    <p class="chapter">${esc(content.about.chapter)}</p>
    <div class="about-copy" data-reveal>
      <p class="kicker">${esc(content.about.kicker)}</p>
      <p class="display" data-split>${esc(content.about.intro)}</p>
    </div>
    <a class="text-link link-draw about-more" href="${href(base, "/about/")}" data-transition="${content.themes.paper.page}">${esc(content.about.more)} ${arrow()}</a>
    ${portrait()}
    <blockquote class="about-quote" data-reveal>${lines(content.about.quote)}</blockquote>
    <p class="about-note await" data-reveal-block><span class="line-mask"><span class="line" data-line>${esc(content.about.note)}</span></span></p>
  </section>`;
}

function renderWorkTitle(content, base) {
  const frames = content.projects
    .map((project, index) => {
      const image = project.images[0];
      return `<img src="${media(base, image.src)}" alt="${esc(content.workTitle.label)}: ${esc(project.title)}" width="${image.w}" height="${image.h}" ${index === 0 ? 'class="is-on"' : ""} ${index === 0 ? "" : 'loading="lazy"'}>`;
    })
    .join("");
  return `<section class="panel work-title" data-panel="work-title" data-section="work-title" aria-label="${esc(content.workTitle.before)} ${esc(content.workTitle.after)}" ${themeAttrs(content.themes.paper)}>
    <div class="wt-stage">
      <p class="wt-word wt-more" data-wt-more>${esc(content.workTitle.before)}</p>
      <p class="wt-word wt-work" data-wt-work>${esc(content.workTitle.after)}</p>
      <div class="wt-rect" data-wt-rect>${frames}</div>
    </div>
  </section>`;
}

function renderWork(content, base) {
  const items = content.projects
    .map((project, index) => {
      return `<li class="work-item" data-work-item data-work-index="${index}">
        <a href="${href(base, projectPath(project.slug))}" data-transition="${esc(project.transition)}" aria-label="${esc(project.title)}">
          <span class="work-text"><span class="line-mask"><span class="line" data-line>${esc(project.title)}</span></span></span>
          <span class="work-arrow" data-work-arrow>${arrow()}</span>
        </a>
        <span class="work-rule" data-work-rule></span>
        <span class="work-rule work-rule-hot" data-work-hot></span>
      </li>`;
    })
    .join("");
  const previews = content.projects
    .map((project, index) => {
      const image = project.images[0];
      return `<img data-work-image="${index}" src="${media(base, image.src)}" alt="" width="${image.w}" height="${image.h}">`;
    })
    .join("");
  return `<section class="panel work" data-panel="work" data-section="work" aria-label="Ausgewählte Arbeiten" ${themeAttrs(content.themes.sand)}>
    <p class="chapter">${esc(content.work.chapter)}</p>
    <div class="work-copy">
      <p class="kicker await" data-reveal-block><span class="line-mask"><span class="line" data-line>${esc(content.work.kicker)}</span></span></p>
      <ul class="work-list await" data-work-list>${items}</ul>
    </div>
    <a class="text-link link-draw work-all" href="${href(base, "/works/")}" data-transition="${content.themes.sand.page}">${esc(content.work.all)} ${arrow()}</a>
    <div class="work-preview" data-work-preview>
      <span class="work-preview-placeholder" data-work-placeholder></span>
      ${previews}
    </div>
  </section>`;
}

function renderServices(content, base) {
  const cards = content.services.items
    .map(
      (item) => `<article class="service" data-service-item tabindex="0">
        <div class="service-bg" data-service-bg>
          <img data-service-media src="${media(base, item.image)}" alt="${esc(item.alt)}" width="1920" height="1080">
        </div>
        <p class="service-no">${esc(item.no)}</p>
        <h2 class="service-title">${esc(item.title)}</h2>
        <p class="service-text">${esc(item.text)}</p>
      </article>`,
    )
    .join("");
  return `<section class="panel services" data-panel="services" data-section="services" aria-label="Leistungen" ${themeAttrs(content.themes.ink)}>
    <div class="services-row">
      <div class="services-intro">
        <p class="chapter">${esc(content.services.chapter)}</p>
        <div data-reveal>
          <p class="kicker">${esc(content.services.kicker)}</p>
          <p class="display" data-split>${esc(content.services.lead)}</p>
        </div>
      </div>
      ${cards}
    </div>
  </section>`;
}

function renderClients(content) {
  const rows = content.clients.items
    .map((item, index) => {
      const mark = item.name.slice(0, 1);
      return `<li class="client-row" data-client-row data-client-index="${index}">
        <span class="client-text"><span class="line-mask"><span class="line" data-line>${esc(item.name)}</span></span></span>
        <span class="client-mark" data-client-mark aria-hidden="true">${esc(mark)}</span>
      </li>`;
    })
    .join("");
  return `<section class="panel clients" data-panel="clients" data-section="clients" aria-label="Stationen" ${themeAttrs(content.themes.sand)}>
    <p class="chapter">${esc(content.clients.chapter)}</p>
    <div class="clients-copy">
      <p class="kicker await" data-reveal-block><span class="line-mask"><span class="line" data-line>${esc(content.clients.kicker)}</span></span></p>
      <ul class="client-list await" data-client-list>${rows}</ul>
      <p class="client-more await" data-client-more data-reveal-block><span class="line-mask"><span class="line" data-line>${esc(content.clients.more)}</span></span></p>
    </div>
    <p class="clients-note">${esc(content.clients.note)}</p>
    <div class="client-sticky" data-client-sticky aria-hidden="true"></div>
  </section>`;
}

function renderContact(content, base) {
  const socials = content.socials
    .map(
      (item) =>
        `<a class="link-draw" href="${esc(item.href)}" target="_blank" rel="noreferrer">${esc(item.label)}</a>`,
    )
    .join("");
  return `<section class="panel contact" id="${esc(content.contact.id)}" data-panel="contact" data-section="contact" aria-label="Kontakt" ${themeAttrs(content.themes.footer)}>
    <p class="contact-tagline">${esc(content.contact.tagline)}</p>
    <h2 class="display-name contact-heading await" data-char-heading>${lines(content.contact.heading)}</h2>
    <div class="contact-block await" data-reveal-block>
      <span class="line-mask"><span class="line" data-line><span class="kicker">${esc(content.contact.kicker)}</span></span></span>
      <span class="line-mask"><span class="line" data-line><a class="contact-mail link-draw" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a></span></span>
    </div>
    <nav class="contact-socials" aria-label="${esc(content.contact.socialLabel)}">${socials}</nav>
    <p class="contact-meta">
      <a href="${href(base, "/impressum/")}" data-transition="${content.themes.paper.page}">${esc(content.contact.imprint)}</a>
    </p>
  </section>`;
}

function renderFeature(section, content) {
  const theme = content.themes[section.theme] || content.themes.ink;
  return `<section class="panel feature" data-panel="${esc(section.id)}" data-section="${esc(section.id)}" ${themeAttrs(theme)}>
    <p class="chapter">${esc(section.chapter || "")}</p>
    <div class="feature-copy">
      <p class="kicker">${esc(section.kicker || "")}</p>
      <h2 class="display-name">${esc(section.title || "")}</h2>
      <p class="display" data-split>${esc(section.text || "")}</p>
    </div>
  </section>`;
}

function renderPanel(section, content, base) {
  if (section.enabled === false) return "";
  switch (section.type) {
    case "hero":
      return renderHero(content);
    case "about":
      return renderAbout(content, base);
    case "work-title":
      return renderWorkTitle(content, base);
    case "work":
      return renderWork(content, base);
    case "services":
      return renderServices(content, base);
    case "clients":
      return renderClients(content);
    case "contact":
      return renderContact(content, base);
    case "feature":
      return renderFeature(section, content);
    default:
      return "";
  }
}

function pageShell({ content, base, title, description, page, current, body, pageBg, headerTheme }) {
  const font = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500&display=swap";
  return `<!doctype html>
<html lang="${esc(content.lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="${esc(pageBg)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <link rel="icon" href="${media(base, "favicon.svg")}" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${font}">
  <link rel="stylesheet" href="/src/styles/main.css">
  ${jsonLd(content, base)}
  <script>
    document.documentElement.classList.add("js");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    try {
      var cover = sessionStorage.getItem("folio-cover");
      if (cover) document.documentElement.style.background = cover;
    } catch (error) {}
  </script>
</head>
<body data-page="${esc(page)}" data-transition="${esc(pageBg)}" style="background:${esc(pageBg)}">
  ${chrome(content, base, current, headerTheme)}
  <main id="inhalt">${body}</main>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;
}

function innerFooter(content, base) {
  const socials = content.socials
    .map((item) => `<a href="${esc(item.href)}" target="_blank" rel="noreferrer">${esc(item.label)}</a>`)
    .join("");
  return `<footer class="page-foot">
    <a class="contact-mail link-draw" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a>
    <nav aria-label="Sozial">${socials}</nav>
    <a href="${href(base, "/impressum/")}" data-transition="${content.themes.paper.page}">${esc(content.contact.imprint)}</a>
  </footer>`;
}

export function renderDocument(kind, baseInput, extra = {}) {
  const base = normalizeBase(baseInput);
  const content = getContent();
  if (kind === "home") {
    const panels = content.story.map((section) => renderPanel(section, content, base)).join("");
    return pageShell({
      content,
      base,
      title: content.meta.title,
      description: content.meta.description,
      page: "home",
      current: "home",
      pageBg: content.themes.hero.page,
      body: `<div class="story" id="site-top" data-story>
        <div class="pin" data-pin>
          <div class="track" data-track>${panels}</div>
        </div>
      </div>`,
    });
  }

  if (kind === "about") {
    const topics = content.about.topics
      .map(
        (topic) => `<section class="topic" data-reveal>
          <h2>${esc(topic.title)}</h2>
          <p data-split>${esc(topic.text)}</p>
        </section>`,
      )
      .join("");
    return pageShell({
      content,
      base,
      title: `${content.about.pageTitle} — ${content.person.name}`,
      description: content.about.lead,
      page: "about",
      current: "about",
      pageBg: content.themes.paper.page,
      headerTheme: content.themes.paper,
      body: `<article class="subpage">
        <p class="kicker">${esc(content.about.pageTitle)}</p>
        <h1 class="lede" data-split>${esc(content.about.lead)}</h1>
        <div class="topics">${topics}</div>
        ${innerFooter(content, base)}
      </article>`,
    });
  }

  if (kind === "works") {
    const cards = content.projects
      .map((project, index) => {
        const image = project.images[0];
        const number = String(index + 1).padStart(2, "0");
        return `<a class="work-card" href="${href(base, projectPath(project.slug))}" data-transition="${esc(project.transition)}">
          <span class="work-card-media"><img src="${media(base, image.src)}" alt="${esc(image.alt)}" width="${image.w}" height="${image.h}"></span>
          <span class="work-card-meta"><span class="kicker">${number}</span><span class="work-card-title">${esc(project.title)}</span><span class="work-card-role">${esc(project.details.join(" · "))}</span></span>
        </a>`;
      })
      .join("");
    return pageShell({
      content,
      base,
      title: `${content.work.pageTitle} — ${content.person.name}`,
      description: content.work.pageLead,
      page: "works",
      current: "works",
      pageBg: content.themes.sand.page,
      headerTheme: content.themes.sand,
      body: `<article class="subpage">
        <p class="kicker">${esc(content.work.pageTitle)}</p>
        <h1 class="lede" data-split>${esc(content.work.pageLead)}</h1>
        <div class="work-index">${cards}</div>
        ${innerFooter(content, base)}
      </article>`,
    });
  }

  if (kind === "project") {
    const project = content.projects.find((item) => item.slug === extra.slug);
    if (!project) throw new Error(`Unknown project ${extra.slug}`);
    const index = content.projects.findIndex((item) => item.slug === project.slug);
    const next = content.projects[(index + 1) % content.projects.length];
    const figures = project.images
      .map(
        (image) => `<figure class="shot">
          <span class="shot-overlay" data-shot-overlay></span>
          <img src="${media(base, image.src)}" alt="${esc(image.alt)}" width="${image.w}" height="${image.h}" loading="lazy">
        </figure>`,
      )
      .join("");
    const details = project.details.map((line) => `<span>${esc(line)}</span>`).join("");
    return pageShell({
      content,
      base,
      title: `${project.title} — ${content.person.name}`,
      description: `${project.title}: ${project.details.join(", ")}`,
      page: "project",
      current: "works",
      pageBg: content.themes.paper.page,
      headerTheme: content.themes.paper,
      body: `<article class="subpage project">
        <a class="text-link link-draw back" href="${href(base, "/works/")}" data-transition="${content.themes.sand.page}">${esc(content.work.index)}</a>
        <p class="kicker">${String(index + 1).padStart(2, "0")}</p>
        <h1 class="project-title">${esc(project.title)}</h1>
        <p class="project-details">${details}</p>
        <div class="gallery">${figures}</div>
        <a class="text-link link-draw next-project" href="${href(base, projectPath(next.slug))}" data-transition="${esc(next.transition)}">${esc(content.work.next)} — ${esc(next.title)} ${arrow()}</a>
        ${innerFooter(content, base)}
      </article>`,
    });
  }

  if (kind === "imprint") {
    const blocks = content.imprint.blocks
      .map(
        (block) => `<section>
          <h2>${esc(block.heading)}</h2>
          ${block.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
        </section>`,
      )
      .join("");
    return pageShell({
      content,
      base,
      title: `${content.imprint.title} — ${content.person.name}`,
      description: `${content.imprint.title} von ${content.person.name}`,
      page: "imprint",
      current: "",
      pageBg: content.themes.paper.page,
      headerTheme: content.themes.paper,
      body: `<article class="subpage imprint">
        <p class="kicker">${esc(content.imprint.intro)}</p>
        <h1>${esc(content.imprint.title)}</h1>
        ${blocks}
        <p><a class="contact-mail link-draw" href="mailto:${esc(content.person.email)}">${esc(content.person.email)}</a></p>
        ${innerFooter(content, base)}
      </article>`,
    });
  }

  if (kind === "missing") {
    return pageShell({
      content,
      base,
      title: `${content.notFound.title} — ${content.person.name}`,
      description: content.notFound.title,
      page: "missing",
      current: "",
      pageBg: content.themes.paper.page,
      headerTheme: content.themes.paper,
      body: `<article class="subpage">
        <h1 class="lede">${esc(content.notFound.title)}</h1>
        <a class="text-link link-draw" href="${href(base, "/")}" data-transition="${content.themes.hero.page}">${esc(content.notFound.link)}</a>
      </article>`,
    });
  }

  throw new Error(`Unknown page ${kind}`);
}

export function pageList(baseInput) {
  const content = getContent();
  const pages = [
    { id: "main", file: "index.html", kind: "home" },
    { id: "missing", file: "404.html", kind: "missing" },
    { id: "about", file: "about/index.html", kind: "about" },
    { id: "works", file: "works/index.html", kind: "works" },
    { id: "imprint", file: "impressum/index.html", kind: "imprint" },
  ];
  for (const project of content.projects) {
    pages.push({
      id: `work-${project.slug}`,
      file: `works/${project.slug}/index.html`,
      kind: "project",
      slug: project.slug,
    });
  }
  return pages.map((page) => ({ ...page, base: normalizeBase(baseInput) }));
}
