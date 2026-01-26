# Multi-Agent Research Assistant (OpenAI Agents SDK)

A sophisticated multi-agent AI system built to research real-world topics, reason over them, and produce structured reports.

## 🧩 Modular Architecture

The system is organized into a clean, modular structure:

- **src/agents/**: Contains individual agent definitions.
  - `manager.ts`: The Orchestrator.
  - `researcher.ts`: The Fact-Finder (uses Tavily).
  - `writer.ts`: The Report Synthesizer.
- **src/tools/**: Contains external tool integrations.
  - `tavily.ts`: Tavily Search API wrapper.
- **src/client.ts**: Central configuration for OpenAI/OpenRouter.
- **src/index.ts**: Main CLI entry point.

## 🛠 Tech Stack

- **SDK**: OpenAI Agents SDK
- **LLM**: OpenRouter (Gemini 2.0 Flash)
- **Search**: Tavily Search API
- **Runtime**: Node.js + TypeScript

## 🚀 Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Update your `.env` file:
   ```env
   OPENROUTER_API_KEY=...
   TAVILY_API_KEY=...
   GEMINI_MODEL=google/gemini-2.0-flash-exp
   ```

## 📖 How to Run

### Interactive CLI Mode
Just run the command without arguments to enter interactive mode:
```bash
npx ts-node src/index.ts
```

### Direct Query Mode
Pass the query as an argument:
```bash
npx ts-node src/index.ts "Compare Stripe vs Razorpay for a SaaS in Pakistan"
```

## 🔄 Agent Roles & Rules

- **Manager**: Analyzes query, delegates to Research, then to Writer.
- **ResearchAgent**: Strictly factual. Only agent allowed to use Tavily.
- **WriterAgent**: Format specialist. Produces structured Markdown reports with sources.
