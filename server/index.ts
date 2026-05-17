import "dotenv/config";
import express, { Response, NextFunction } from 'express';
import type { Request } from 'express';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "node:http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ── PT hardening (Round 3) ───────────────────────────────────────────────────
//
// Helmet with a CSP that allows our own assets and Google Fonts (used by
// "Exo 2"). Inline styles are permitted because shadcn / Radix UI emit a
// handful of inline style attributes; we DO NOT allow inline scripts.
// Frames are denied, HSTS is on for production, MIME-sniffing is blocked,
// and referrer is restricted to same-origin → cross-origin downgrade.
const isProd = process.env.NODE_ENV === "production";

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,    // Recharts / blob URLs
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: false } : false,
    frameguard: { action: "deny" },
    noSniff: true,
  }),
);

// CORS allow-list — only the production Vercel domain plus local dev origins.
const ALLOWED_ORIGINS = new Set<string>([
  "https://cx-platform-six.vercel.app",
  "http://localhost:5000",
  "http://localhost:5173",
]);
app.use(
  cors({
    origin: (origin, cb) => {
      // No-origin requests (curl, same-origin browsers) are fine.
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.has(origin)) return cb(null, true);
      return cb(new Error("Origin not allowed"));
    },
    credentials: true,
  }),
);

// Per-IP rate limit on the API surface — 60 req/min.
app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, slow down." },
  }),
);

// Body-size cap — abort early on suspicious payloads.
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// Health-check endpoint (Round 3 — used by uptime probes).
app.get("/api/healthz", (_req, res) => {
  res.json({ ok: true, version: "2026.05.17.r3" });
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
