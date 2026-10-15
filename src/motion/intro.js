import gsap from "gsap";
import { motionScale, state } from "./state.js";
import { refreshHeader } from "./header.js";

export function mountIntro(onDone) {
  const hero = document.querySelector('[data-panel="hero"]');
  const header = document.querySelector("[data-intro-header]");
  if (!hero || !header) {
    state.introDone = true;
    onDone?.();
    return () => {};
  }
  if (state.reduced || skipIntro()) {
    showHeroEnd(hero, header);
    state.introDone = true;
    onDone?.();
    return () => {};
  }

  const scale = motionScale();
  const slide = hero.querySelector("[data-slide-label]");
  const nameWrap = hero.querySelector("[data-hero-name]");
  const nameLines = hero.querySelectorAll("[data-name-heading] [data-line]");
  const slideLines = slide ? slide.querySelectorAll("[data-line]") : [];
  const tagline = hero.querySelector("[data-hero-tagline]");
  const metas = [...hero.querySelectorAll(".hero-place, .hero-open, .hero-scroll")];
  const wash = hero.querySelector("[data-hero-wash]");

  gsap.set(nameWrap, { autoAlpha: 1 });
  gsap.set([...nameLines, ...slideLines], { yPercent: 102 });
  if (wash) gsap.set(wash, { scaleX: 0, height: 8, transformOrigin: "0% 100%" });

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      hero.dataset.headerBg = "#3a3632";
      markRevealed(hero);
      refreshHeader();
      state.introDone = true;
      onDone?.();
    },
  });

  timeline.to(header, { opacity: 1, duration: 2.5 * scale, ease: "power3.out" }, 0.5 * scale);
  if (slideLines.length) {
    timeline.fromTo(
      slideLines,
      { yPercent: 102 },
      { yPercent: 0, duration: 1.7 * scale, stagger: 0.2 * scale, ease: "power3.out" },
      0.15,
    );
  }
  if (wash) {
    timeline.to(wash, { scaleX: 1, duration: 2.1 * scale, ease: "power4.inOut" }, 0.3);
  }
  timeline.addLabel("handoff", 2);
  if (slide) {
    timeline.to(slide, { yPercent: -180, duration: 1.78 * scale, ease: "power4.inOut" }, "handoff");
  }
  if (nameLines.length) {
    timeline.fromTo(
      nameLines,
      { yPercent: 102 },
      {
        yPercent: 0,
        duration: 1.7 * scale,
        stagger: 0.2 * scale,
        ease: "power3.out",
        transformOrigin: "50% 100%",
      },
      "handoff+=0.12",
    );
  }
  revealBlock(timeline, tagline, scale, "handoff+=0.85");
  metas.forEach((meta) => revealBlock(timeline, meta, scale, "handoff+=1.05"));
  if (wash) {
    timeline.to(wash, { height: "100%", duration: 1.1 * scale, ease: "power2.inOut" }, "handoff+=1.7");
  }

  return () => timeline.kill();
}

function revealBlock(timeline, element, scale, position) {
  if (!element) return;
  const lines = element.querySelectorAll("[data-line]");
  timeline.set(element, { opacity: 1 }, position);
  if (lines.length) {
    timeline.fromTo(
      lines,
      { yPercent: 102 },
      { yPercent: 0, duration: 1 * scale, stagger: 0.12 * scale, ease: "power3.out" },
      position,
    );
  }
}

function showHeroEnd(hero, header) {
  gsap.set(header, { opacity: 1 });
  gsap.set(hero.querySelector("[data-hero-name]"), { autoAlpha: 1 });
  gsap.set(hero.querySelector("[data-slide-label]"), { autoAlpha: 0 });
  gsap.set(hero.querySelectorAll(".await"), { opacity: 1 });
  gsap.set(hero.querySelectorAll("[data-line]"), { yPercent: 0 });
  const wash = hero.querySelector("[data-hero-wash]");
  if (wash) gsap.set(wash, { scaleX: 1, height: "100%", transformOrigin: "0% 100%" });
  hero.dataset.headerBg = "#3a3632";
  markRevealed(hero);
  refreshHeader();
}

function markRevealed(root) {
  root.querySelectorAll("[data-reveal], [data-reveal-block]").forEach((node) => {
    node.dataset.revealed = "true";
  });
}

function skipIntro() {
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation?.type === "reload") return false;
  if (location.hash) return true;
  if (!document.referrer) return false;
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === location.origin && referrer.pathname !== location.pathname;
  } catch {
    return false;
  }
}
