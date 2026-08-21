import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Trail Blaze Trekking API" });
  });

  // AI Trek Planner endpoint
  app.post("/api/gemini/trek-plan", async (req, res) => {
    try {
      const { region, durationDays, fitnessLevel, season, preferences } = req.body;
      const ai = getAIClient();

      if (!ai) {
        // Fallback curated itinerary if API key not yet supplied
        return res.json({
          trailName: `${region || "Alpine Crest"} High Route Expedition`,
          tagline: `A custom ${durationDays || 5}-day trek crafted for ${fitnessLevel || "Moderate"} hikers during ${season || "Autumn"}.`,
          difficulty: fitnessLevel === "Advanced" ? "Strenuous (Grade IV)" : "Moderate (Grade II-III)",
          elevationGain: "4,250m",
          distance: `${(durationDays || 5) * 14} km total`,
          bestMonths: season || "June - October",
          itinerary: [
            {
              day: 1,
              title: "Basecamp Assembly & Acclimatization",
              distance: "9 km",
              ascent: "+450m",
              summary: "Ascend through pine valleys, check alpine gear, and set camp near glacial stream."
            },
            {
              day: 2,
              title: "High Ridge Traverse & Granite Passes",
              distance: "14 km",
              ascent: "+820m",
              summary: "Climb through steep switchbacks to panoramic col with 360-degree mountain peaks."
            },
            {
              day: 3,
              title: "Alpine Lake Valley & Glacial Moraine",
              distance: "16 km",
              ascent: "+950m",
              summary: "Cross rocky scree fields to pristine turquoise tarns; sunset photography over serrated crests."
            },
            {
              day: 4,
              title: "Summit Push or High Saddle Crossing",
              distance: "12 km",
              ascent: "+1,100m",
              summary: "Pre-dawn alpine start with headlamps, summit ridge celebration, descending to shelter refuge."
            },
            {
              day: 5,
              title: "Valley Descent & Celebration Dinner",
              distance: "11 km",
              ascent: "-1,200m",
              summary: "Scenic descent along roaring waterfalls, hot springs relaxation, and expedition debrief."
            }
          ],
          gearChecklist: [
            "45-55L Technical Trekking Pack with rain cover",
            "Gore-Tex Hardshell Jacket & breathable mid-layer fleece",
            "Rigid-sole trekking boots with ankle support (broken in)",
            "Carbon fiber trekking poles with snow baskets",
            "0°C rated lightweight down sleeping bag",
            "Water filtration system (0.1 micron) & electrolyte tabs",
            "High-output LED headlamp (300+ lumens) with spare battery"
          ],
          safetyTips: [
            "Monitor for Acute Mountain Sickness (AMS); descend if severe headache/nausea persists.",
            "Always register your trek itinerary with local park rangers before departure.",
            "Carry emergency satellite messenger (Garmin inReach / SPOT).",
            "Pack out all waste (Leave No Trace standard)."
          ]
        });
      }

      const prompt = `You are a world-class certified mountain trekking guide and expedition leader for "Trail Blaze Trekking".
Create an authentic, detailed trekking itinerary and trail guide based on these specifications:
- Destination/Region: ${region || "Himalayan Ridge / Alps / Rockies"}
- Duration: ${durationDays || 5} days
- Fitness Level: ${fitnessLevel || "Moderate"}
- Target Season: ${season || "Autumn"}
- Specific Interests / Style: ${preferences || "Scenic vistas, mountain passes, alpine lakes, wild camping"}

Return ONLY valid JSON matching this exact structure:
{
  "trailName": "string",
  "tagline": "string",
  "difficulty": "string (e.g. Easy, Moderate, Strenuous, Alpine Grade)",
  "elevationGain": "string (e.g. 3,850m)",
  "distance": "string (e.g. 68 km)",
  "bestMonths": "string",
  "itinerary": [
    {
      "day": 1,
      "title": "string",
      "distance": "string",
      "ascent": "string",
      "summary": "string"
    }
  ],
  "gearChecklist": [
    "item 1",
    "item 2",
    "item 3",
    "item 4",
    "item 5"
  ],
  "safetyTips": [
    "tip 1",
    "tip 2",
    "tip 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const plan = JSON.parse(text);
      res.json(plan);
    } catch (err: any) {
      console.error("Gemini AI Trek generation error:", err);
      res.status(500).json({
        error: "Failed to generate AI trek itinerary",
        details: err?.message || "Internal server error"
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Trail Blaze Trekking server running on http://localhost:${PORT}`);
  });
}

startServer();
