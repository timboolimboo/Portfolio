import gsap from "gsap";
import { state } from "./state.js";
import { syncScroll } from "./lenis.js";
import { lockHeaderTheme, unlockHeaderTheme } from "./header.js";

const MENU_THEME = { bg: "transparent", text: "#f3eee8", border: "#5a524d" };

export function mountMenu() {
  const dialog = document.querySelector("#site-menu");
  const toggle = document.querySelector("#menu-toggle");
  const panel = document.querySelector("[data-menu-panel]");
  const main = document.querySelector("main");
  if (!dialog || !toggle || !panel) return () => {};

  let timeline = null;

  const open = () => {
    if (dialog.open) return;
    if (!state.reduced) gsap.set(panel, { clipPath: "inset(0 100% 0 0)" });
    dialog.show();
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menü schließen");
    main?.setAttribute("inert", "");
    lockHeaderTheme(MENU_THEME);
    syncScroll();
    const lines = [...dialog.querySelectorAll(".nav-label [data-line], .menu-close")];
    if (state.reduced) {
      gsap.set(panel, { clearProps: "clipPath" });
      gsap.set(lines, { yPercent: 0 });
      const active = dialog.querySelector('[data-nav-active="true"] [data-nav-active-line]');
      if (active) gsap.set(active, { scaleX: 1, transformOrigin: "0% 50%" });
      return;
    }
    gsap.set(dialog.querySelectorAll(".nav-label [data-line]"), { yPercent: 102 });
    timeline?.kill();
    timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.to(panel, { clipPath: "inset(0 0% 0 0)", duration: 0.88 }, 0);
    [...dialog.querySelectorAll("[data-nav-item]")].forEach((item, index) => {
      const itemLines = item.querySelectorAll(".nav-label [data-line]");
      timeline.fromTo(
        itemLines,
        { yPercent: 102 },
        { yPercent: 0, duration: 1, ease: "power2.out", stagger: 0.07 },
        0.14 + index * 0.15,
      );
    });
    const active = dialog.querySelector('[data-nav-active="true"] [data-nav-active-line]');
    if (active) {
      gsap.set(active, { scaleX: 0, transformOrigin: "0% 50%" });
      const index = [...dialog.querySelectorAll("[data-nav-item]")].findIndex((item) => item.dataset.navActive === "true");
      timeline.to(active, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0.14 + Math.max(index, 0) * 0.15 + 0.5);
    }
  };

  const close = () => {
    if (!dialog.open) return;
    const finish = () => {
      dialog.close();
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
      main?.removeAttribute("inert");
      unlockHeaderTheme();
      syncScroll();
      timeline = null;
    };
    if (state.reduced) {
      finish();
      return;
    }
    timeline?.kill();
    const lines = dialog.querySelectorAll(".nav-label [data-line]");
    const active = dialog.querySelector("[data-nav-active-line]");
    timeline = gsap.timeline({ defaults: { ease: "power3.in" }, onComplete: finish });
    if (active) timeline.to(active, { scaleX: 0, duration: 0.28, ease: "power2.in" }, 0);
    timeline.to(lines, { yPercent: 102, duration: 0.45, stagger: { each: 0.04, from: "end" } }, 0);
    timeline.to(panel, { clipPath: "inset(0 100% 0 0)", duration: 0.58 }, 0.08);
  };

  const onToggle = () => (dialog.open ? close() : open());
  const onKey = (event) => {
    if (event.key === "Escape" && dialog.open) {
      event.preventDefault();
      close();
    }
  };
  toggle.addEventListener("click", onToggle);
  dialog.querySelectorAll("[data-menu-close]").forEach((button) => button.addEventListener("click", close));
  window.addEventListener("keydown", onKey);

  return () => {
    toggle.removeEventListener("click", onToggle);
    window.removeEventListener("keydown", onKey);
    timeline?.kill();
  };
}

export function closeMenuImmediate() {
  const dialog = document.querySelector("#site-menu");
  const toggle = document.querySelector("#menu-toggle");
  const main = document.querySelector("main");
  if (!dialog?.open) return;
  dialog.close();
  toggle?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", "Menü öffnen");
  main?.removeAttribute("inert");
  unlockHeaderTheme();
  syncScroll();
}
