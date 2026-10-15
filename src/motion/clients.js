import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isDesktop } from "./state.js";

export function mountClients() {
  const rows = [...document.querySelectorAll("[data-client-row]")];
  const list = document.querySelector("[data-client-list]");
  const sticky = document.querySelector("[data-client-sticky]");
  if (!rows.length) return () => {};
  const cleanups = [];

  const clear = () => {
    list?.classList.remove("is-hot");
    rows.forEach((row) => row.classList.remove("is-active"));
  };
  const activate = (index) => {
    if (!isDesktop()) return;
    list?.classList.add("is-hot");
    rows.forEach((row, rowIndex) => row.classList.toggle("is-active", rowIndex === index));
  };

  rows.forEach((row, index) => {
    const enter = () => activate(index);
    const focusOut = (event) => {
      if (!list?.contains(event.relatedTarget)) clear();
    };
    row.addEventListener("pointerenter", enter);
    row.addEventListener("focusin", enter);
    row.addEventListener("focusout", focusOut);
    cleanups.push(() => {
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("focusin", enter);
      row.removeEventListener("focusout", focusOut);
    });
  });
  if (list) {
    const leave = (event) => {
      if (!list.contains(event.relatedTarget)) clear();
    };
    list.addEventListener("pointerleave", leave);
    cleanups.push(() => list.removeEventListener("pointerleave", leave));
  }

  if (!isDesktop() && sticky) {
    const marks = rows.map((row) => row.querySelector("[data-client-mark]")?.textContent?.trim() || "");
    let current = -1;
    const show = (index) => {
      if (index === current) return;
      const next = marks[index] || "";
      if (current >= 0) {
        gsap.fromTo(sticky, { yPercent: 20, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" });
      }
      sticky.textContent = next;
      current = index;
    };
    rows.forEach((row, index) => {
      const trigger = ScrollTrigger.create({
        trigger: row,
        start: "top center",
        end: "bottom center",
        onEnter: () => show(index),
        onEnterBack: () => show(index),
      });
      cleanups.push(() => trigger.kill());
    });
    show(0);
    rows.forEach((row, index) => {
      gsap.set(row, { autoAlpha: 1 });
      row.style.opacity = "";
    });
  }

  return () => cleanups.forEach((fn) => fn());
}
