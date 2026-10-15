import { defineConfig } from "vite";
import { writePages } from "./src/render/write.js";

const base = process.env.BASE_PATH || "/";
const input = writePages(process.cwd(), base);

export default defineConfig({
  base,
  appType: "mpa",
  build: {
    rollupOptions: { input },
  },
});
