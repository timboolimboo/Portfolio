import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";

const root = join(process.cwd(), "dist");
const port = Number(process.env.PORT) || 80;
const host = "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

function insideRoot(file) {
  return file === root || file.startsWith(root + sep);
}

function resolveFile(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relative = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
  const file = join(root, relative);
  if (!insideRoot(file)) return null;
  return file;
}

function send(res, status, file) {
  res.writeHead(status, {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(file).pipe(res);
}

const server = createServer((req, res) => {
  try {
    let file = resolveFile(req.url);
    if (!file) {
      res.writeHead(400);
      res.end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (existsSync(file) && statSync(file).isFile()) {
      send(res, 200, file);
      return;
    }
    const missing = join(root, "404.html");
    if (existsSync(missing)) {
      send(res, 404, missing);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  } catch {
    res.writeHead(400);
    res.end();
  }
});

server.listen(port, host, () => {
  console.log(`serving ${root} on ${host}:${port}`);
});
