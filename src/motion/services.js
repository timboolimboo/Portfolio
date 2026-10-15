import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { state } from "./state.js";

export function mountServices() {
  const items = [...document.querySelectorAll("[data-service-item]")];
  if (!items.length) return () => {};
  const desktop = window.matchMedia("(min-width: 768px)");
  const cleanups = [];

  const bind = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
    items.forEach((item) => {
      const bg = item.querySelector("[data-service-bg]");
      const media = item.querySelector("[data-service-media]");
      if (!bg || !media) return;
      if (desktop.matches) {
        gsap.set(bg, { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(media, { yPercent: 6, scale: 1.08, transformOrigin: "center center" });
        const enter = () => {
          gsap.killTweensOf([bg, media]);
          if (state.reduced) {
            gsap.set(bg, { clipPath: "inset(0% 0% 0% 0%)" });
            gsap.set(media, { yPercent: -3 });
            return;
          }
          gsap.timeline()
            .to(bg, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.out" }, 0)
            .to(media, { yPercent: -3, duration: 0.8, ease: "power3.out" }, 0);
        };
        const leave = () => {
          gsap.killTweensOf([bg, media]);
          if (state.reduced) {
            gsap.set(bg, { clipPath: "inset(100% 0% 0% 0%)" });
            return;
          }
          gsap.timeline({
            onComplete: () => gsap.set(bg, { clipPath: "inset(100% 0% 0% 0%)" }),
          })
            .to(bg, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power3.out" }, 0)
            .to(media, { yPercent: -9, duration: 0.8, ease: "power3.out" }, 0);
        };
        item.addEventListener("pointerenter", enter);
        item.addEventListener("pointerleave", leave);
        item.addEventListener("focusin", enter);
        item.addEventListener("focusout", leave);
        cleanups.push(() => {
          item.removeEventListener("pointerenter", enter);
          item.removeEventListener("pointerleave", leave);
          item.removeEventListener("focusin", enter);
          item.removeEventListener("focusout", leave);
          gsap.killTweensOf([bg, media]);
        });
        return;
      }

      gsap.set(bg, { clearProps: "clipPath", autoAlpha: state.reduced ? 1 : 0 });
      gsap.set(media, { scale: 1, yPercent: 0 });
      if (state.reduced) return;
      const tween = gsap.timeline({ paused: true })
        .to(bg, { autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 0)
        .to(media, { scale: 1.2, duration: 0.8, ease: "power3.out" }, 0);
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: "top 75%",
        end: "bottom 25%",
        toggleActions: "play reverse play reverse",
        animation: tween,
      });
      cleanups.push(() => {
        trigger.kill();
        tween.kill();
      });
    });
  };

  bind();
  const onChange = () => bind();
  desktop.addEventListener("change", onChange);
  return () => {
    desktop.removeEventListener("change", onChange);
    cleanups.forEach((fn) => fn());
  };
}
