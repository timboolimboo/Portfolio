export const state = {
  lenis: null,
  horizontal: null,
  panelScroll: {},
  reduced: false,
};

export function isDesktop() {
  return window.matchMedia("(min-width: 768px)").matches;
}

export function motionScale() {
  return window.innerWidth < 768 ? 0.86 : 1;
}
