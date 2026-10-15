import { defineConfig } from "vite";
import { writePages } from "./src/render/write.js";

// No BASE_PATH means the site is served at the domain root ("/").
// The GitHub Pages workflow is the only place that sets BASE_PATH=/Portfolio/.
const base = process.env.BASE_PATH || "/";
const input = writePages(process.cwd(), base);

export default defineConfig({
  base,
  appType: "mpa",
  build: {
    rollupOptions: { input },
  },
});
