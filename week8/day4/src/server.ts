import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Runner } from "@openai/agents";
import { modelProvider } from "./client.js";
import { managerAgent } from "./agents/manager.js";
import { researchAgent } from "./agents/researcher.js";
import { writerAgent } from "./agents/writer.js";
import {
    workRelatedGuardrail,
    emptyInputGuardrail,
    lengthGuardrail
} from "./guardrails/index.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- Swagger Configuration ---

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Multi-Agent Research Pipeline API",
            version: "1.1.0",
            description: "An API for automated research using a linear pipeline of AI agents: Manager -> ResearchAgent -> WriterAgent.",
        },
        servers: [
            {
                url: process.env.BACKEND_URL,
                description: "Local development server",
            },
        ],
    },
    apis: ["./src/server.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API Endpoints ---

/**
 * @swagger
 * /research:
 *   post:
 *     summary: Trigger a linear multi-agent research pipeline
 *     description: Starts a research task where a Manager delegates to a ResearchAgent, who then hands off to a WriterAgent for the final report.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: "Latest trends in renewable energy"
 *     responses:
 *       200:
 *         description: Research completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 query:
 *                   type: string
 *                 finalOutput:
 *                   type: string
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid input or guardrail violation
 *       500:
 *         description: Server error
 */
app.post("/research", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        console.log(`\n[API] New research request: "${query}"`);

        // Apply Guardrails
        emptyInputGuardrail.validate(query);
        lengthGuardrail.validate(query, 500);
        workRelatedGuardrail.validate(query);

        // Configure Handoffs (Linear Workflow: Manager -> Research -> Writer)
        managerAgent.handoffs = [researchAgent];
        researchAgent.handoffs = [writerAgent];
        // writerAgent.handoffs = []; // No handoff back, returns final output to user

        // Initialize Runner
        const runner = new Runner({ modelProvider } as any);

        // Collect trace history
        const history: any[] = [];
        runner.on("agent_start", (_, agent) => {
            history.push({ event: "agent_start", agent: agent.name });
            console.log(`>>> [Agent Start] ${agent.name}`);
        });
        runner.on("agent_tool_start", (_, agent, tool) => {
            history.push({ event: "tool_start", agent: agent.name, tool: tool.name });
            console.log(`    [Tool Start] ${tool.name}`);
        });
        runner.on("agent_handoff", (_, from, to) => {
            history.push({ event: "handoff", from: from.name, to: to.name });
            console.log(`<<< [Handoff] ${from.name} -> ${to.name}`);
        });

        // Run the cycle
        const result = await runner.run(managerAgent, query, { maxTurns: 15 });

        res.json({
            query,
            finalOutput: result.finalOutput,
            history
        });

    } catch (error: any) {
        console.error(`[API Error] ${error.message}`);
        res.status(error.message.includes("Guardrail") || error.message.includes("empty") || error.message.includes("long") ? 400 : 500).json({
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`📖 Swagger docs available at http://localhost:${port}/api-docs`);
});
