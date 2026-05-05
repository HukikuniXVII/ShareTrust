import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { db } from './src/db';
import { gearItems, users } from './src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(ClerkExpressWithAuth());
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing from environment variables.");
}
const genAI = new GoogleGenAI({ apiKey: apiKey || "placeholder" });

// API Routes
app.post("/api/extract-images", async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: "Missing HTML content" });

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
        Extract all gear-relevant image URLs from the following HTML content. 
        Return ONLY a JSON array of strings (the URLs). 
        Filter out avatars, tiny icons, logos, or tracking pixels. 
        Focus on product photos.
        
        HTML Content:
        ${html.slice(0, 15000)}
      `,
    });
    const text = result.text;
    const urls = JSON.parse(text.match(/\[.*\]/s)?.[0] || "[]");

    res.json({ images: urls });
  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({ error: "Failed to extract images" });
  }
});

// --- Gear Endpoints ---
app.get("/api/gear", async (req, res) => {
  try {
    const items = await db.select().from(gearItems).all();
    res.json(items);
  } catch (error) {
    console.error("Error fetching gear:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/gear/:id", async (req, res) => {
  try {
    const item = await db.select().from(gearItems).where(eq(gearItems.id, req.params.id)).get();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/gear", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    // @ts-ignore - req.auth is injected by Clerk
    const userId = req.auth.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const newItem = {
      ...req.body,
      id: uuidv4(),
      ownerId: userId,
      rating: 5.0,
      reviewCount: 0,
      status: "Available"
    };

    await db.insert(gearItems).values(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating gear:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- User Endpoints ---
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users).all();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, req.params.id)).get();
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vite middleware setup
async function startServer() {
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
