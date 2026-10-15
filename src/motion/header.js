import { state } from "./state.js";

let update = () => {};

export function mountHeader() {
  const header = document.querySelector("[data-intro-header]");
  const bar = document.querySelector("[data-scroll-progress]");
  if (!header) return () => {};
  const sections = [...document.querySelectorAll("[data-header-bg]")].filter((node) => node !== header);

  update = () => {
    if (header.dataset.locked === "menu") return;
    const x = window.innerWidth >= 768 ? Math.max(96, window.innerWidth * 0.12) : window.innerWidth * 0.5;
    const y = window.innerWidth >= 768 ? window.innerHeight * 0.42 : 72;
    const hit =
      sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.left <= x && rect.right >= x && rect.top <= y && rect.bottom >= y;
      }) ||
      sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= y && rect.bottom >= y;
      });
    if (hit) applyHeader(hit.dataset.headerBg, hit.dataset.headerText, hit.dataset.headerBorder);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = window.innerWidth >= 768 ? `scaleY(${progress})` : `scaleX(${progress})`;
    }
  };

  update();
  state.lenis?.on("scroll", update);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

export function refreshHeader() {
  update();
}

export function applyHeader(bg, text, border) {
  const header = document.querySelector("[data-intro-header]");
  if (!header) return;
  if (bg) header.style.setProperty("--header-bg", bg);
  if (text) header.style.setProperty("--header-text", text);
  if (border) header.style.setProperty("--header-border", border);
}

export function lockHeaderTheme(theme) {
  const header = document.querySelector("[data-intro-header]");
  if (!header) return;
  header.dataset.locked = "menu";
  applyHeader(theme.bg, theme.text, theme.border);
}

export function unlockHeaderTheme() {
  const header = document.querySelector("[data-intro-header]");
  if (!header) return;
  delete header.dataset.locked;
  update();
}
