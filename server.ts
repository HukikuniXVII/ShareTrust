import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini API Setup
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
