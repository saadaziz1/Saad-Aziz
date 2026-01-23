import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Runner, Agent } from "@openai/agents";
import { modelProvider } from "./client.js";
import { moderator } from "./agents.js";
import { workRelatedGuardrail } from "./guardrails.js";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- Swagger Configuration ---

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Agentic Roundtable API",
            version: "1.0.0",
            description: "A multi-agent discussion system powered by Gemini and OpenAI Agents SDK.",
        },
        servers: [
            {
                url: "https://saad-aziz-13.onrender.com",
                description: "Local server",
            },
        ],
    },
    apis: ["./src/server.ts"], // Pointing to this file for documentation annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- API Endpoints ---



/**
 * @swagger
 * /discuss:
 *   post:
 *     summary: Trigger a multi-agent roundtable discussion
 *     description: Starts a discussion between a Moderator and multiple specialized experts on a given topic.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "The future of Artificial General Intelligence"
 *     responses:
 *       200:
 *         description: Discussion concluded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topic:
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
app.post("/discuss", async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
    }

    try {
        console.log(`\n[API] New discussion request: "${topic}"`);

        // Apply Guardrail
        console.log("[System] Checking guardrails...");
        workRelatedGuardrail.validate(topic);

        // Initialize Runner with throttling and limits
        const runner = new Runner({
            modelProvider,
            modelSettings: { max_completion_tokens: 1000 },
            callModelInputFilter: async (args: any) => {
                // Throttling to respect Gemini 15 RPM limit
                console.log(`[API] Throttling 4s for ${args.agent.name}...`);
                await new Promise(resolve => setTimeout(resolve, 4000));
                return args.modelData;
            }
        } as any);

        // Collect discussion history for the response
        const history: any[] = [];
        runner.on("agent_start", (_, agent) => {
            history.push({ event: "agent_start", agent: agent.name });
            console.log(`>>> [Agent Start] ${agent.name}`);
        });

        runner.on("agent_tool_start", (_, agent, tool) => {
            history.push({ event: "agent_tool_start", tool: tool.name });
            console.log(`<<< [Agent Tool Start] ${tool.name}`);
        });
        runner.on("agent_handoff", (_, from, to) => {
            history.push({ event: "handoff", from: from.name, to: to.name });
            console.log(`<<< [Handoff] ${from.name} -> ${to.name}`);
        });

        // Run the discussion
        const result = await runner.run(moderator, topic, { maxTurns: 15 });

        console.log("[API] Discussion concluded.");

        res.json({
            topic,
            finalOutput: result.finalOutput,
            history
        });

    } catch (error: any) {
        console.error(`[API Error] ${error}`);
        res.status(error.message.includes("Guardrail") ? 400 : 500).json({
            error: error
        });
    }
});

app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`📖 Swagger docs available at http://localhost:${port}/api-docs`);
});
