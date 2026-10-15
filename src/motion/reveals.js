import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isDesktop, motionScale, state } from "./state.js";

export function mountReveals() {
  if (state.reduced) {
    gsap.set("[data-reveal], [data-reveal-block], .await, .portrait-art, .hero-name", { opacity: 1, autoAlpha: 1 });
    gsap.set("[data-line]", { yPercent: 0 });
    gsap.set("[data-shot-overlay], [data-portrait-overlay]", { autoAlpha: 0 });
    document.querySelectorAll(".link-draw").forEach((link) => link.classList.add("is-drawn"));
    return () => {};
  }

  const cleanups = [];
  const desktop = isDesktop() && state.horizontal;
  const scale = motionScale();

  document.querySelectorAll("[data-reveal], [data-reveal-block], [data-char-heading]").forEach((block) => {
    if (block.closest('[data-panel="hero"]')) return;
    if (block.dataset.revealed === "true") return;
    const lines = [...block.querySelectorAll("[data-line]")];
    if (!lines.length) return;
    gsap.set(lines, { yPercent: 102 });
    const stagger = block.hasAttribute("data-char-heading") ? 0.2 : block.closest("[data-work-list], [data-client-list]") ? 0.12 : 0.07;
    const timeline = gsap.timeline({ paused: true });
    timeline.set(block, { opacity: block.hasAttribute("data-client-more") ? 0.5 : 1 });
    timeline.fromTo(
      lines,
      { yPercent: 102 },
      {
        yPercent: 0,
        duration: (block.hasAttribute("data-char-heading") ? 1.7 : 1.7) * scale,
        ease: "power3.out",
        stagger: stagger * scale,
        transformOrigin: block.hasAttribute("data-char-heading") ? "50% 100%" : "50% 100%",
      },
    );
    const trigger = ScrollTrigger.create({
      trigger: block,
      animation: timeline,
      once: true,
      containerAnimation: desktop ? state.horizontal : undefined,
      start: desktop ? "left 78%" : "top 82%",
      onEnter: () => {
        block.dataset.revealed = "true";
      },
    });
    cleanups.push(() => trigger.kill());
  });

  const rules = document.querySelector("[data-work-list]");
  if (rules && rules.dataset.rulesDrawn !== "true") {
    const lines = [...rules.querySelectorAll("[data-work-rule]")];
    gsap.set(lines, { scaleX: 0, transformOrigin: "0 50%" });
    const trigger = ScrollTrigger.create({
      trigger: rules,
      once: true,
      containerAnimation: desktop ? state.horizontal : undefined,
      start: desktop ? "left 70%" : "top 80%",
      onEnter: () => {
        rules.dataset.rulesDrawn = "true";
        gsap.to(lines, { scaleX: 1, duration: 1, ease: "power3.out", stagger: 0.12 });
      },
    });
    cleanups.push(() => trigger.kill());
  }

  document.querySelectorAll(".link-draw").forEach((link) => {
    if (link.dataset.drawn === "true") {
      link.classList.add("is-drawn");
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: link,
      once: true,
      containerAnimation: desktop ? state.horizontal : undefined,
      start: desktop ? "left 85%" : "top 90%",
      onEnter: () => {
        link.dataset.drawn = "true";
        link.classList.add("is-drawn");
      },
    });
    cleanups.push(() => trigger.kill());
  });

  const portrait = document.querySelector("[data-portrait]");
  const overlay = document.querySelector("[data-portrait-overlay]");
  const art = document.querySelector("[data-portrait-art]");
  if (portrait && overlay && art && portrait.dataset.revealed !== "true") {
    gsap.set(art, { autoAlpha: 0 });
    gsap.set(overlay, { scaleY: 1, transformOrigin: "top center" });
    const trigger = ScrollTrigger.create({
      trigger: portrait,
      once: true,
      containerAnimation: desktop ? state.horizontal : undefined,
      start: desktop ? "left 75%" : "top 75%",
      onEnter: () => {
        portrait.dataset.revealed = "true";
        gsap.to(art, { autoAlpha: 1, duration: 0.8, ease: "power3.out" });
        gsap.to(overlay, { scaleY: 0, duration: 1.1, ease: "power3.inOut", transformOrigin: "top center" });
      },
    });
    cleanups.push(() => trigger.kill());
  }

  document.querySelectorAll(".shot").forEach((shot) => {
    const veil = shot.querySelector("[data-shot-overlay]");
    if (!veil || shot.dataset.revealed === "true") return;
    gsap.set(veil, { scaleY: 1, transformOrigin: "top center" });
    const trigger = ScrollTrigger.create({
      trigger: shot,
      start: "top 80%",
      once: true,
      onEnter: () => {
        shot.dataset.revealed = "true";
        gsap.to(veil, { scaleY: 0, duration: 1.1, ease: "power3.inOut", transformOrigin: "top center" });
      },
    });
    cleanups.push(() => trigger.kill());
  });

  return () => cleanups.forEach((fn) => fn());
}
