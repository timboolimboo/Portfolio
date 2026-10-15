export function splitElement(element) {
  if (!(element instanceof HTMLElement) || element.dataset.splitDone === "true") {
    return element?.querySelectorAll?.("[data-line]") ?? [];
  }
  const text = element.textContent.replace(/\s+/g, " ").trim();
  if (!text) return [];
  const words = text.split(" ");
  element.replaceChildren();
  const holders = words.map((word, index) => {
    const span = document.createElement("span");
    span.className = "split-word";
    span.textContent = word;
    element.appendChild(span);
    if (index < words.length - 1) element.appendChild(document.createTextNode(" "));
    return span;
  });

  const groups = [];
  let current = [];
  let top = null;
  holders.forEach((span) => {
    const next = span.offsetTop;
    if (top === null || Math.abs(next - top) <= 3) {
      current.push(span);
      top = next;
    } else {
      groups.push(current);
      current = [span];
      top = next;
    }
  });
  if (current.length) groups.push(current);

  groups.forEach((group) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    const line = document.createElement("span");
    line.className = "line";
    line.dataset.line = "";
    group[0].parentNode.insertBefore(mask, group[0]);
    group.forEach((span, index) => {
      line.appendChild(span);
      if (index < group.length - 1) line.appendChild(document.createTextNode(" "));
    });
    mask.appendChild(line);
  });

  [...element.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });
  element.dataset.splitDone = "true";
  return element.querySelectorAll("[data-line]");
}

export function splitAll(root = document) {
  root.querySelectorAll("[data-split]").forEach((element) => splitElement(element));
}
