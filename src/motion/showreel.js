import { state } from "./state.js";

export function mountShowreel() {
  const images = [...document.querySelectorAll("[data-wt-rect] img")];
  if (images.length < 2 || state.reduced) return () => {};
  let index = 0;
  images.forEach((image, imageIndex) => image.classList.toggle("is-on", imageIndex === 0));
  const id = window.setInterval(() => {
    images[index].classList.remove("is-on");
    index = (index + 1) % images.length;
    images[index].classList.add("is-on");
  }, 2400);
  return () => window.clearInterval(id);
}
