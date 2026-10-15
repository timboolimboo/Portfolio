import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pageList, renderDocument } from "./markup.js";

export function writePages(root = process.cwd(), base = process.env.BASE_PATH || "/") {
  const input = {};
  for (const page of pageList(base)) {
    const html = renderDocument(page.kind, page.base, { slug: page.slug });
    const file = join(root, page.file);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    input[page.id] = file;
  }
  return input;
}
