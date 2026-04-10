import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const HISTORY_FILE = path.join(process.cwd(), "history.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Middleware
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Gemini Setup
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// API Routes
app.get("/api/history", (req, res) => {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read history" });
  }
});

app.post("/api/history", (req, res) => {
  try {
    const newEntry = req.body;
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    const history = JSON.parse(data);
    history.push({ ...newEntry, id: Date.now().toString(), timestamp: new Date().toISOString() });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save history" });
  }
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ 
    success: true, 
    file: {
      name: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// Intent Detection and Agent Execution
app.post("/api/chat", async (req, res) => {
  const { message, history, agentId } = req.body;

  try {
    // If agentId is provided, we use that agent. Otherwise, we detect intent.
    let selectedAgentId = agentId;
    
    if (!selectedAgentId) {
      const intentResponse = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the user input and return ONLY the ID of the most appropriate agent from this list:
        1. meeting-summary
        2. sales-assistant
        3. financial-analyst
        4. marketing-campaign
        5. social-media-manager
        6. business-strategy
        7. code-review
        8. hr-assistant
        9. document-generator
        10. knowledge-graph
        11. data-cleaning
        12. prompt-engineering
        13. research-summarizer
        14. product-recommendation
        15. compliance-policy
        16. personal-productivity
        17. training-content
        18. interview-question
        19. business-report
        20. multi-agent-research

        User Input: "${message}"
        
        If unclear, return "general".`,
      });
      selectedAgentId = intentResponse.text.trim().toLowerCase();
    }

    // Execute agent logic
    const agentPrompts: Record<string, string> = {
      "meeting-summary": "You are a Meeting Summary Agent. Summarize the provided notes. Format: Summary, Key Points, Action Items, Email Draft.",
      "sales-assistant": "You are an AI Sales Assistant. Create a sales pitch and strategy. Format: Target, Pitch, Strategy.",
      "financial-analyst": "You are an AI Financial Analyst. Analyze the data. Format: Overview, Metrics, Forecast, Risk.",
      "marketing-campaign": "You are an AI Marketing Campaign Agent. Design a campaign. Format: Goals, Channels, Content Ideas, Budget Estimate.",
      "social-media-manager": "You are an AI Social Media Manager. Create a content plan. Format: Platform, Post Copy, Hashtags, Schedule.",
      "business-strategy": "You are an AI Business Strategy Agent. Provide strategic advice. Format: Analysis, Objectives, Roadmap, KPIs.",
      "code-review": "You are an AI Code Review Agent. Review the code. Format: Summary, Issues, Suggestions, Security Check.",
      "hr-assistant": "You are an AI HR Assistant. Assist with HR tasks. Format: Task Summary, Recommendations, Next Steps.",
      "document-generator": "You are an AI Document Generator. Generate the requested document content. Format: Title, Content, Structure.",
      "knowledge-graph": "You are an AI Knowledge Graph Agent. Extract entities and relationships. Format: Entities, Relationships, Insights.",
      "data-cleaning": "You are an AI Data Cleaning Agent. Suggest data cleaning steps. Format: Issues Found, Cleaning Steps, Final Format.",
      "prompt-engineering": "You are an AI Prompt Engineering Assistant. Improve the prompt. Format: Original, Improved, Explanation.",
      "research-summarizer": "You are an AI Research Paper Summarizer. Summarize the paper. Format: Abstract, Methodology, Results, Conclusion.",
      "product-recommendation": "You are an AI Product Recommendation Agent. Recommend products. Format: User Profile, Recommendations, Reasoning.",
      "compliance-policy": "You are an AI Compliance & Policy Agent. Check for compliance. Format: Policy Check, Violations, Recommendations.",
      "personal-productivity": "You are an AI Personal Productivity Agent. Help with productivity. Format: Goal, Schedule, Tips, Tools.",
      "training-content": "You are an AI Training Content Generator. Create training material. Format: Module Title, Objectives, Content, Quiz.",
      "interview-question": "You are an AI Interview Question Generator. Generate questions. Format: Role, Question, Expected Answer, Evaluation Criteria.",
      "business-report": "You are an AI Business Report Generator. Generate a report. Format: Executive Summary, Detailed Analysis, Conclusion.",
      "multi-agent-research": "You are a Multi-Agent Research & Report Generator. Coordinate multiple perspectives. Format: Research Findings, Integrated Report, Final Recommendation.",
      "general": "You are a general AI assistant. Help the user with their request."
    };

    const systemInstruction = agentPrompts[selectedAgentId] || agentPrompts["general"];

    const chatResponse = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction,
      }
    });

    res.json({
      agentId: selectedAgentId,
      response: chatResponse.text,
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// Vite middleware for development
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
