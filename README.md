# AI SUPER HUB: Integrated Multi-Agent Ecosystem

The **AI SUPER HUB** is a high-performance, centralized platform that orchestrates 20 specialized AI agents. Using an advanced **Intent Detection & Routing** engine, the system automatically maps user queries to the optimal agent, delivering structured, professional outputs through a unified, mobile-responsive interface.

---

## 🤖 AI Agent Descriptions (20 Advanced Agents)

1.  **Meeting Summary Agent**: Processes raw transcripts to generate concise summaries, key discussion points, action items, and follow-up email drafts.
2.  **AI Sales Assistant**: Crafts tailored sales pitches and outreach strategies by analyzing target audience demographics and value propositions.
3.  **AI Financial Analyst**: Evaluates financial datasets to provide high-level overviews, key performance metrics, growth forecasts, and risk assessments.
4.  **AI Marketing Campaign Agent**: Develops comprehensive end-to-end marketing strategies, including multi-channel plans, messaging, and demographic targeting.
5.  **AI Social Media Manager**: Generates platform-specific content calendars, captions, and engagement strategies to optimize digital presence across social networks.
6.  **AI Business Strategy Agent**: Conducts SWOT analyses and competitive market research to suggest long-term growth roadmaps and operational optimizations.
7.  **AI Code Review Agent**: Analyzes source code for bugs, security vulnerabilities, and style inconsistencies, providing optimized snippets and refactoring advice.
8.  **AI HR Assistant**: Streamlines recruitment and internal operations by drafting job descriptions, policy explainers, and employee engagement initiatives.
9.  **AI Document Generator**: Transforms raw notes or data into professionally formatted documents, templates, and structured business letters.
10. **AI Knowledge Graph Agent**: Maps complex relationships between entities and data points to visualize information architecture and hidden connections.
11. **AI Data Cleaning Agent**: Identifies and fixes inconsistencies, duplicates, and missing values in datasets (CSV/JSON) to ensure high-quality analysis.
12. **AI Prompt Engineering Assistant**: Refines and optimizes user prompts using advanced iterative techniques to extract the highest quality responses from LLMs.
13. **AI Research Paper Summarizer**: Distills dense academic papers into accessible summaries, highlighting methodologies, core findings, and cited conclusions.
14. **AI Product Recommendation Agent**: Leverages user behavior and preference data to suggest relevant products, improving conversion and personalized shopping experiences.
15. **AI Compliance & Policy Agent**: Cross-references business practices against legal standards and internal policies to ensure full regulatory compliance.
16. **AI Personal Productivity Agent**: Optimizes daily workflows by organizing tasks, prioritizing schedules, and suggesting time-management techniques based on user goals.
17. **AI Training Content Generator**: Designs structured educational modules, instructional materials, and learning paths for corporate training or personal development.
18. **AI Interview Question Generator**: Produces role-specific technical and behavioral interview questions, complete with evaluation rubrics and expected answer guides.
19. **AI Business Report Generator**: Compiles data from various sources into executive-level reports with structured headers, insights, and strategic summaries.
20. **Multi-Agent Research & Report Generator**: Coordinates multiple agents simultaneously to handle complex, multi-step queries that require deep research and cross-domain synthesis.

---

## 📂 Project Architecture

```text
ai-super-hub/
├── frontend/        # React/Next.js UI (Tailwind, PWA support)
├── backend/         # Node.js (Express) Orchestration Layer
├── agents/          # Individual Logic & Tools for 20 Agents
├── prompts/         # System instructions for Intent Routing
├── public/          # Static assets and icons
└── README.md        # Full documentation and Setup Guide
```

## 🚀 Deployment & Installation

### 1. Prerequisites
* Node.js (v18+)
* Gemini API Key

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/your-username/ai-super-hub.git

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

### 3. Running the System
* **Backend:** `node index.js` (Runs on Port 5000)
* **Frontend:** `npm run dev` (Runs on Port 3000)

### 4. Deployment
* **Web:** Deploy `frontend` on Vercel and `backend` on Render/Railway.
* **Mobile:** Enable the PWA manifest in `next.config.js` or wrap the frontend using Capacitor for native Android/iOS builds.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
