const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".apk": "application/vnd.android.package-archive",
  ".txt": "text/plain; charset=utf-8",
};

function sendResponse(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

function resolveFilePath(requestUrl) {
  const rawPath = decodeURIComponent((requestUrl || "/").split("?")[0]);
  const normalizedPath = rawPath === "/" ? "/index.html" : rawPath;
  const safeRelativePath = path.normalize(normalizedPath).replace(/^([.][.][/\\])+/, "");
  const resolvedPath = path.join(ROOT_DIR, safeRelativePath);

  if (!resolvedPath.startsWith(ROOT_DIR)) {
    return null;
  }

  return resolvedPath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFilePath(req.url);

  if (!filePath) {
    sendResponse(res, 403, "Access denied");
    return;
  }

  let finalPath = filePath;
  if (fs.existsSync(finalPath) && fs.statSync(finalPath).isDirectory()) {
    finalPath = path.join(finalPath, "index.html");
  }

  fs.readFile(finalPath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendResponse(res, 404, "Not found");
        return;
      }

      sendResponse(res, 500, "Server error");
      return;
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    sendResponse(res, 200, content, contentType);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Cap sur le Quiz running on http://${HOST}:${PORT}`);
});
