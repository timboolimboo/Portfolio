import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { state } from "./motion/state.js";
import { splitAll } from "./motion/split.js";
import { mountLenis, syncScroll } from "./motion/lenis.js";
import { mountClock } from "./motion/clock.js";
import { mountHeader } from "./motion/header.js";
import { mountMenu } from "./motion/menu.js";
import { mountTransitions } from "./motion/transition.js";
import { mountShowreel } from "./motion/showreel.js";
import { mountHorizontal, scrollToHash } from "./motion/horizontal.js";
import { mountIntro } from "./motion/intro.js";
import { mountReveals } from "./motion/reveals.js";
import { mountWorkHover } from "./motion/work.js";
import { mountServices } from "./motion/services.js";
import { mountClients } from "./motion/clients.js";

gsap.registerPlugin(ScrollTrigger);

export async function boot() {
  state.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  state.introDone = document.body.dataset.page !== "home";
  state.lenis = mountLenis();
  syncScroll();

  try {
    await document.fonts.ready;
  } catch {
    /* fonts are progressive */
  }

  // Drop the pre-paint translate before GSAP reads transforms. Otherwise it
  // caches translateY(102%) as a pixel offset and line reveals stay clipped.
  document.documentElement.classList.add("motion-ready");
  splitAll();
  mountClock();
  mountHeader();
  mountMenu();
  mountTransitions();
  mountShowreel();

  if (document.body.dataset.page === "home") {
    mountWorkHover();
    mountServices();
    mountClients();
    let stopEffects = () => {};
    let width = window.innerWidth;
    const build = (preserve) => {
      const previous = preserve ? ScrollTrigger.getById("h-scroll")?.progress ?? 0 : 0;
      stopEffects();
      mountHorizontal();
      stopEffects = mountReveals();
      const trigger = ScrollTrigger.getById("h-scroll");
      if (trigger && previous > 0) {
        const y = trigger.start + previous * (trigger.end - trigger.start);
        state.lenis?.scrollTo(y, { immediate: true, force: true });
      }
    };
    build(false);
    window.addEventListener("resize", () => {
      window.clearTimeout(build.timer);
      build.timer = window.setTimeout(() => {
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        build(true);
      }, 180);
    });
    mountIntro(() => {
      syncScroll();
      ScrollTrigger.refresh();
      if (location.hash) scrollToHash(location.hash);
    });
    return;
  }

  mountReveals();
  syncScroll();
  gsap.to("[data-intro-header]", {
    opacity: 1,
    duration: state.reduced ? 0 : 0.8,
    ease: "power3.out",
  });
  ScrollTrigger.refresh();
}
