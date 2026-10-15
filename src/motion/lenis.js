import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { state } from "./state.js";

export function mountLenis() {
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function syncScroll() {
  const menuOpen = document.querySelector("#site-menu")?.open;
  const locked = !state.introDone || menuOpen;
  if (locked) state.lenis?.stop();
  else state.lenis?.start();
}
