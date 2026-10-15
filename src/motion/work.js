import gsap from "gsap";
import { isDesktop } from "./state.js";

export function mountWorkHover() {
  const list = document.querySelector("[data-work-list]");
  if (!list) return () => {};
  const items = [...list.querySelectorAll("[data-work-item]")];
  const images = [...document.querySelectorAll("[data-work-image]")];
  const placeholder = document.querySelector("[data-work-placeholder]");
  gsap.set(images, { autoAlpha: 0, scale: 0, transformOrigin: "center center" });

  const clear = () => {
    list.classList.remove("is-hot");
    items.forEach((item) => item.classList.remove("is-active"));
    gsap.to(list.querySelectorAll("[data-work-hot]"), { scaleX: 0, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    gsap.to(images, { autoAlpha: 0, scale: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    if (placeholder) placeholder.style.opacity = "1";
  };

  const activate = (index) => {
    if (!isDesktop()) return;
    list.classList.add("is-hot");
    items.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
    const rules = [...list.querySelectorAll("[data-work-hot]")];
    gsap.to(rules, { scaleX: 0, duration: 0.3, ease: "power3.out", overwrite: "auto" });
    if (rules[index]) gsap.to(rules[index], { scaleX: 1, duration: 1, ease: "power3.out", overwrite: "auto" });
    const image = images[index];
    if (!image) return;
    if (placeholder) placeholder.style.opacity = "0";
    images.forEach((candidate, imageIndex) => {
      if (imageIndex !== index && Number(gsap.getProperty(candidate, "autoAlpha")) > 0) {
        gsap.to(candidate, { autoAlpha: 0, scale: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
      }
    });
    gsap.killTweensOf(image);
    gsap.set(image, { autoAlpha: 1, scale: 0, zIndex: 1 });
    gsap.to(image, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
  };

  const cleanups = [];
  items.forEach((item) => {
    const index = Number(item.dataset.workIndex);
    const enter = () => activate(index);
    const focusOut = (event) => {
      if (!list.contains(event.relatedTarget)) clear();
    };
    item.addEventListener("pointerenter", enter);
    item.addEventListener("focusin", enter);
    item.addEventListener("focusout", focusOut);
    cleanups.push(() => {
      item.removeEventListener("pointerenter", enter);
      item.removeEventListener("focusin", enter);
      item.removeEventListener("focusout", focusOut);
    });
  });
  const leave = (event) => {
    if (!list.contains(event.relatedTarget)) clear();
  };
  list.addEventListener("pointerleave", leave);
  return () => {
    list.removeEventListener("pointerleave", leave);
    cleanups.forEach((fn) => fn());
  };
}
