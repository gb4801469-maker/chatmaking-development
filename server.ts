import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI client to prevent crashes if API key is not configured yet
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured. Please add your key to SECRETS in the Settings menu of AI Studio.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
};

// System instruction mappings for all matching categories requested by the user
const getSystemInstruction = (mode: string): string => {
  const basePrompt = "You are an advanced AI assistant similar to ChatGPT: friendly, modern, smart, and confident. You explain simple concepts first, then provide deep insights with examples. Always structure your replies elegantly with clear headings, bullets, and spacing. Answer accurately and intelligently.";

  switch (mode) {
    case "coding":
      return `${basePrompt} You are acting as a Code Specialist. Write clean, optimal, and modern TypeScript/JavaScript or desired language code. Always explain your logic step-by-step, explain any potential edge cases, add clean inline comments, and suggest structural improvements.`;
    case "study":
      return `${basePrompt} You are acting as an expert Academic Tutor. Teach like an encouraging, world-class professor. Don't just give answers directly—explain the 'why' behind formulas, historical contexts, or rules. Use analogical explanations, add checklist recaps, and ALWAYS conclude your response with a 1-question interactive multiple-choice quiz (e.g. 'Interactive Check: ...') to test the user's understanding of what you just taught.`;
    case "tech":
      return `${basePrompt} You are acting as a Tech Architect. Focus on deep technological structures, trade-offs between frameworks, modern DB schemas, AI/ML tools, systems architecture, security best practices, and enterprise-grade tech discussions.`;
    case "business":
      return `${basePrompt} You are acting as a Business Brainstormer & Startup Builder. Highlight monetization pathways, initial capital requirements, marketing strategies, and target audience persona. Keep suggestions highly practical, actionable, and focused on genuine revenue-generating side hustles or business models.`;
    case "writing":
      return `${basePrompt} You are acting as a Creative Writer & Content Strategist. Assist with screenplays, captivating scripts, deep newsletters, hooks, or elegant prose. Use rhythm and evocative words, avoiding boring buzzwords.`;
    case "motivation":
      return `${basePrompt} You are acting as a High-Performance Personal Coach. Inspire action, list productivity frameworks (like time-boxing or the Ivy Lee method), and write with realistic, energetic, structured advice to shift mental states.`;
    case "marketing":
      return `${basePrompt} You are acting as a Growth Marketer & Branding Strategist. Provide viral hooks, audience targeting layouts, aesthetic post layouts, visual descriptions, suggested hashtags, and scheduling templates.`;
    case "prompts":
      return `${basePrompt} You are acting as a Design/Prompt Visionary. Your main output should be aesthetic, cinematic prompt descriptions for image generators (e.g. Imagen, Midjourney). Include detailed lighting instructions (sunset, volumetric, chiaroscuro), camera focal lengths (e.g. 85mm f/1.4), artistic reference eras, and specific color grading (teal & orange, muted pastel).`;
    case "solving":
      return `${basePrompt} You are acting as a Logic Expert & Mathematical Analyst. Solve logical issues, riddles, math theorems, or core code bugs using First-Principles reasoning. Outline a clear reasoning chain and prove your answers.`;
    case "chatbot":
      return `${basePrompt} You are acting as an expert Chatbot Developer & Conversational Architect. Help users design intelligent chatbot architectures, conversational flows, state machines, prompt engineering patterns, context window strategies, retrieval-augmented generation (RAG) pipelines, and API webhooks for platforms like WhatsApp, Discord, Slack, or custom web UIs. Always provide extremely detailed, well-structured, production-ready blueprints or code examples.`;
    default:
      return `${basePrompt} Help with any general topic while being fast, witty, and highly helpful.`;
  }
};

// Main chat generation API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, mode } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();
    const systemInstruction = getSystemInstruction(mode || "chatbot");

    // Format messages to match Gemini @google/genai SDK expected signature
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I was unable to formulate a response.";
    res.json({ text: reply });

  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      error: err.message || "An unexpected server error occurred during compilation.",
      isConfigError: err.message?.includes("GEMINI_API_KEY") || false,
    });
  }
});

// Special Route: Cinematic Prompt Builder
app.post("/api/prompt-craft", async (req, res) => {
  try {
    const { rawPrompt } = req.body;
    if (!rawPrompt) {
      return res.status(400).json({ error: "A brief prompt/topic is required." });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Transform this basic concept into an incredibly detailed, aesthetic, cinematic text-to-image prompt: "${rawPrompt}"`,
      config: {
        systemInstruction: "You are an expert prompt engineer for photorealistic or artistic image generative models. Convert user concepts into a structured masterpiece prompt. Detail the target: [Subject], [Background setting], [Lighting style], [Camera lens, aperture, angle], [Color style, grading, contrast], [Artistic mood/medium]. Keep your formatting extremely clean with clear headings and a single copy-paste block.",
        temperature: 0.8,
      },
    });

    res.json({ prompt: response.text });
  } catch (err: any) {
    console.error("Prompt Craft Error:", err);
    res.status(500).json({
      error: err.message || "An unexpected error occurred while crafting your prompt.",
      isConfigError: err.message?.includes("GEMINI_API_KEY") || false,
    });
  }
});

// Special Route: Business Canvas Builder
app.post("/api/business-craft", async (req, res) => {
  try {
    const { businessIdea } = req.body;
    if (!businessIdea) {
      return res.status(400).json({ error: "A business idea or industry is required." });
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a structured business model blueprint for the following idea: "${businessIdea}"`,
      config: {
        systemInstruction: `You are an expert venture capitalist and startup strategist. Analyze the business idea and structure it into an elegant, comprehensive Business Model Canvas layout. Provide details on:
        1. Unique Value Proposition (What sets this apart?)
        2. Customer Personas & Target Market
        3. Marketing & Distribution Channels (How to get initial users?)
        4. Main Cost Structures (Rough estimation of starter items needed)
        5. Key Revenue Streams (How exactly does it make money?)
        6. Essential Steps (The first 3 actions to start immediately)
        Format with clear typography, bold titles, and tables or bulleted sections.`,
        temperature: 0.7,
      },
    });

    res.json({ blueprint: response.text });
  } catch (err: any) {
    console.error("Business Craft Error:", err);
    res.status(500).json({
      error: err.message || "An unexpected error occurred while building the business canvas.",
      isConfigError: err.message?.includes("GEMINI_API_KEY") || false,
    });
  }
});

// Vite & Static file handler definitions
const setupServer = async () => {
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
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

setupServer();
