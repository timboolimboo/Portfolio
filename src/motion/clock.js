export function mountClock() {
  const node = document.querySelector("[data-clock]");
  if (!node) return () => {};
  const zone = "Europe/Berlin";
  const tick = () => {
    const now = new Date();
    const time = new Intl.DateTimeFormat("de-DE", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const offset = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName");
    node.textContent = `(${offset?.value || "GMT"})  ${time}`;
  };
  tick();
  const id = window.setInterval(tick, 30000);
  return () => window.clearInterval(id);
}
