import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { DEFAULT_CONFIG } from "./src/constants.ts";
import type { ElectionConfig } from "./src/types.ts";

dotenv.config();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidElectionConfig(value: unknown): value is ElectionConfig {
  if (!value || typeof value !== "object") {
    return false;
  }

  const config = value as Partial<ElectionConfig>;
  return (
    typeof config.electionName === "string" &&
    Array.isArray(config.questions) &&
    Array.isArray(config.parties)
  );
}

function hasValidPassword(body: unknown, expectedPassword: string): boolean {
  if (!body || typeof body !== "object") {
    return false;
  }

  const { password } = body as { password?: unknown };
  return isNonEmptyString(password) && password === expectedPassword;
}

const adminPasswordFromEnv = process.env.ADMIN_PASSWORD;

if (!isNonEmptyString(adminPasswordFromEnv)) {
  throw new Error("Missing required environment variable: ADMIN_PASSWORD");
}

const ADMIN_PASSWORD = adminPasswordFromEnv;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "config.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with a larger limit to handle big configs
  app.use(express.json({ limit: "10mb" }));

  // Ensure data directory exists
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Could not create data directory:", err);
  }

  // API Routes
  app.get("/api/config", async (req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (e: any) {
      if (e.code === "ENOENT") {
        res.json(DEFAULT_CONFIG);
      } else {
        res.status(500).json({ error: "Failed to read config" });
      }
    }
  });

  app.post("/api/auth", (req, res) => {
    if (!hasValidPassword(req.body, ADMIN_PASSWORD)) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    res.json({ success: true });
  });

  app.post("/api/config", async (req, res) => {
    try {
      if (!hasValidPassword(req.body, ADMIN_PASSWORD)) {
        res.status(401).json({ error: "Invalid API password" });
        return;
      }

      const payload = req.body as { config?: unknown };
      if (!isValidElectionConfig(payload.config)) {
        res.status(400).json({ error: "Invalid config payload" });
        return;
      }

      await fs.writeFile(DATA_FILE, JSON.stringify(payload.config, null, 2), "utf-8");
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Failed to save config" });
    }
  });

  app.post("/api/reset", async (req, res) => {
    if (!hasValidPassword(req.body, ADMIN_PASSWORD)) {
      res.status(401).json({ error: "Invalid API password" });
      return;
    }

    try {
      await fs.unlink(DATA_FILE);
    } catch (e: any) {
      // Ignore error if file doesn't exist
    }
    res.json(DEFAULT_CONFIG);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
