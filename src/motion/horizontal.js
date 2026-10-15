import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isDesktop, state } from "./state.js";

let cleanup = () => {};

export function mountHorizontal() {
  cleanup();
  cleanup = createHorizontal();
  return cleanup;
}

export function scrollToPanel(id) {
  const target = state.panelScroll[id];
  if (typeof target === "number" && state.lenis) {
    state.lenis.scrollTo(target, { force: true });
    return;
  }
  const panel = document.querySelector(`[data-panel="${id}"]`) || document.getElementById(id);
  panel?.scrollIntoView();
}

export function scrollToHash(hash) {
  const id = hash.replace("#", "");
  if (!id) return;
  if (id === "kontakt") scrollToPanel("contact");
  else scrollToPanel(id);
}

function createHorizontal() {
  const pin = document.querySelector("[data-pin]");
  const track = document.querySelector("[data-track]");
  if (!pin || !track) return () => {};
  if (!isDesktop()) return mountMobileTitle();

  const title = track.querySelector('[data-panel="work-title"]');
  const rect = track.querySelector("[data-wt-rect]");
  const more = track.querySelector("[data-wt-more]");
  const work = track.querySelector("[data-wt-work]");

  const layout = (progress) => layoutTitle(rect, more, work, progress, "x");
  layout(state.reduced ? 1 / Math.max(coverScale(rect), 1) : 0);

  const viewport = pin.clientWidth || window.innerWidth;
  const distance = Math.max(0, track.scrollWidth - viewport);
  const centered = title ? -title.offsetLeft + (viewport - title.offsetWidth) / 2 : 0;
  const travelIn = Math.max(0, -centered);
  const travelOut = Math.max(0, distance - travelIn);
  const hold = state.reduced || !title ? 0 : window.innerHeight;
  const proxy = { p: 0 };
  const timeline = gsap.timeline({ defaults: { ease: "none" } });

  if (travelIn > 0) timeline.to(track, { x: centered, duration: travelIn, force3D: true });
  timeline.addLabel("pause");
  if (hold > 0) {
    timeline.to(proxy, { p: 1, duration: hold, onUpdate: () => layout(proxy.p) }, "pause");
  }
  if (travelOut > 0) timeline.to(track, { x: -distance, duration: travelOut, force3D: true });

  const trigger = ScrollTrigger.create({
    id: "h-scroll",
    trigger: pin,
    animation: timeline,
    pin: true,
    scrub: true,
    start: "top top",
    end: `+=${Math.max(travelIn + hold + travelOut, 1)}`,
    anticipatePin: 1,
    fastScrollEnd: true,
  });

  state.horizontal = timeline;
  samplePanels(trigger, timeline);

  return () => {
    trigger.kill();
    timeline.kill();
    if (state.horizontal === timeline) state.horizontal = null;
    gsap.set(track, { clearProps: "transform" });
  };
}

function mountMobileTitle() {
  const section = document.querySelector('[data-panel="work-title"]');
  const rect = document.querySelector("[data-wt-rect]");
  const more = document.querySelector("[data-wt-more]");
  const work = document.querySelector("[data-wt-work]");
  state.horizontal = null;
  if (!section || !rect || !more || !work) return () => {};
  layoutTitle(rect, more, work, 0, "y");
  if (state.reduced) {
    layoutTitle(rect, more, work, 1 / Math.max(coverScale(rect), 1), "y");
    return () => {};
  }

  const proxy = { p: 0 };
  const distance = section.offsetHeight || window.innerHeight;
  const timeline = gsap.timeline({ defaults: { ease: "none" } });
  timeline.to(proxy, {
    p: 1,
    duration: distance,
    onUpdate: () => layoutTitle(rect, more, work, proxy.p, "y"),
  });
  const trigger = ScrollTrigger.create({
    id: "work-title-mobile",
    trigger: section,
    animation: timeline,
    pin: true,
    scrub: true,
    start: "top top",
    end: `+=${distance}`,
    anticipatePin: 1,
  });
  return () => {
    trigger.kill();
    timeline.kill();
  };
}

function coverScale(rect) {
  if (!rect) return 1;
  const bleed = 8;
  const width = rect.offsetWidth || 1;
  const height = rect.offsetHeight || 1;
  return Math.max((window.innerWidth + bleed) / width, (window.innerHeight + bleed) / height);
}

function layoutTitle(rect, more, work, progress, axis) {
  if (!rect || !more || !work) return;
  const cover = coverScale(rect);
  const scale = state.reduced ? 1 : Math.max(0, cover * progress);
  gsap.set(rect, {
    scale,
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "center center",
    force3D: true,
  });
  const gap = 18;
  if (axis === "x") {
    const half = (rect.offsetWidth * scale) / 2;
    gsap.set(more, {
      xPercent: -50,
      yPercent: -50,
      x: -(half + gap + more.offsetWidth / 2),
      y: 0,
      force3D: true,
    });
    gsap.set(work, {
      xPercent: -50,
      yPercent: -50,
      x: half + gap + work.offsetWidth / 2,
      y: 0,
      force3D: true,
    });
    return;
  }
  const half = (rect.offsetHeight * scale) / 2;
  gsap.set(more, {
    xPercent: -50,
    yPercent: -50,
    y: -(half + gap + more.offsetHeight / 2),
    x: 0,
    force3D: true,
  });
  gsap.set(work, {
    xPercent: -50,
    yPercent: -50,
    y: half + gap + work.offsetHeight / 2,
    x: 0,
    force3D: true,
  });
}

function samplePanels(trigger, timeline) {
  const panels = [...document.querySelectorAll("[data-panel]")];
  const map = {};
  const steps = 56;
  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    timeline.progress(progress);
    const scroll = trigger.start + progress * (trigger.end - trigger.start);
    panels.forEach((panel) => {
      const id = panel.dataset.panel;
      if (map[id] == null && panel.getBoundingClientRect().left <= 32) map[id] = scroll;
    });
  }
  timeline.progress(0);
  ScrollTrigger.update();
  state.panelScroll = map;
}
