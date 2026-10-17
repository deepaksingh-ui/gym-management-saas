import http from "http";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, "gym-database.json");
const DIST_DIR = path.join(__dirname, "dist");

// Simple in-memory rate limiter: max 120 requests per minute per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

const isRateLimited = (ip) => {
  // Never rate-limit localhost or loopback
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    ip === "localhost" ||
    ip.includes("127.0.0.1")
  ) {
    return false;
  }

  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, entry);
    return false;
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > MAX_REQUESTS_PER_WINDOW;
};

// Helper to send JSON with Security Headers
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
  });
  res.end(JSON.stringify(data));
};

// MIME types for serving static files from dist/
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const clientIp = req.socket.remoteAddress || "unknown";

  // Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return sendJson(res, 429, {
      success: false,
      error: "Rate limit exceeded. Please wait a minute before sending more requests.",
    });
  }

  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API 1: GET /api/data
  if (url.pathname === "/api/data" && req.method === "GET") {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const json = JSON.parse(raw);
        return sendJson(res, 200, { success: true, data: json });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: "Failed to read database file" });
      }
    } else {
      return sendJson(res, 200, { success: true, data: null });
    }
  }

  // API 2: POST /api/save (Max 5MB payload limit to prevent crash)
  if (url.pathname === "/api/save" && req.method === "POST") {
    let body = "";
    let bodySize = 0;
    const MAX_BODY_SIZE = 5 * 1024 * 1024; // 5MB

    req.on("data", (chunk) => {
      body += chunk;
      bodySize += chunk.length;
      if (bodySize > MAX_BODY_SIZE) {
        req.destroy();
        return sendJson(res, 413, { success: false, error: "Payload too large!" });
      }
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFile(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8", (err) => {
          if (err) {
            return sendJson(res, 500, { success: false, error: "Failed to write database file" });
          }
          return sendJson(res, 200, { success: true, message: "Database saved successfully!" });
        });
      } catch (err) {
        return sendJson(res, 400, { success: false, error: "Invalid JSON payload" });
      }
    });
    return;
  }

  // API 3: GET /api/backup-download
  if (url.pathname === "/api/backup-download" && req.method === "GET") {
    if (fs.existsSync(DB_FILE)) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="gym-database-backup.json"',
        "X-Content-Type-Options": "nosniff",
      });
      fs.createReadStream(DB_FILE).pipe(res);
      return;
    } else {
      return sendJson(res, 404, { success: false, error: "No database file yet" });
    }
  }

  // Serve static files from dist/ (if built)
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, url.pathname === "/" ? "index.html" : url.pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, "index.html"); // SPA fallback
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      });
      res.end(content);
      return;
    } catch {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
  }

  // Default fallback if dist doesn't exist
  sendJson(res, 200, {
    message: "Gym SaaS API Server is running with Rate-Limiting & Security Active.",
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`=======================================================`);
  console.log(`  FitZone Gym Server & Database running on port ${PORT}!`);
  console.log(`  Computer Screen: http://localhost:${PORT}`);

  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if ((net.family === "IPv4" || net.family === 4) && !net.internal) {
        console.log(`  Tablet / Mobile: http://${net.address}:${PORT}`);
      }
    }
  }

  console.log(`  Database File:   ${DB_FILE}`);
  console.log(`  Security Status: Active (120 req/min rate limit + XSS/MIME protection)`);
  console.log(`=======================================================`);
});
