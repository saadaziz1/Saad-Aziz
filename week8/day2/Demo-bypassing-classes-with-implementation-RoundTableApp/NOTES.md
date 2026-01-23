# Agentic AI Fundamentals

## 1. What is Agentic AI?

**Agentic AI** refers to AI systems that don't just respond to a single prompt, but can act autonomously to achieve complex goals through reasoning, planning, and tool usage.

- **Single-prompt vs Agents**: Standard LLM usage is transactional (Question -> Answer). Agents are **iterative**; they use "loops" to think, act, and observe results until their goal is met.
- **Stateful & Goal-Driven**: Agents maintain a "history" or "context" and are given high-level objectives rather than step-by-step instructions.
- **Real-world Examples**:
    - **Customer Support Bot**: Can check order status, issue refunds, and escalate to humans.
    - **SaaS Planner**: Can analyze traffic data, suggest architectures, and write deployment scripts.
    - **Auto-Coder**: Can write, test, and fix bugs in a loop without human intervention.

---

## 2. Core Concepts in OpenAI Agents SDK

- **Agent**: The core persona. It has **Instructions** (System Prompt) that define its role, personality, and constraints.
- **Tool**: Executable functions (e.g., searching web, running code) that an agent can call. This prevents **hallucinations** by grounding the agent in real data/actions.
- **Handoff**: The ability of one agent to delegate to another. This is crucial for **multi-agent systems** where specialized experts (e.g., Math Expert, Security Expert) collaborate.
- **Guardrail**: Validation layers. **Input Guardrails** prevent unsafe prompts; **Output Guardrails** ensure responses are valid, safe, and professional.
- **Runner**: The execution engine that manages the agent's "thinking loop," handles tool calls, and processes handoffs either synchronously or asynchronously.
- **Tracing**: Observability into the agent's inner thoughts. It shows why an agent made a specific decision, which tool it called, and how handoffs occurred.

---

## 3. LLM Configuration Levels

- **Agent-level**: Settings specific to one persona (e.g., Expert 1 uses GPT-4, Expert 2 uses GPT-3.5). 
    - *Use Case*: Giving a high-reasoning model to a "Complex Architect" while using a faster model for a "Grammar Checker".
- **Run-level**: Settings for a specific turn or session (e.g., setting a lower temperature for a specific factual query).
    - *Use Case*: Overriding the default model for a single critical calculation.
- **Global-level**: Default settings for the entire application (e.g., using OpenRouter as the base provider).
    - *Use Case*: Disabling tracing globally for performance or setting a default max token limit for all requests.

> [!NOTE]
> **Agent-level configuration** is usually preferred because it allows the "Right Model for the Right Task," optimizing both quality and cost.

---

## 4. Execution & Observability Observations

During the implementation and testing of the Round Table Discussion, the following observations were made regarding **Tracing** and **SDK Behavior**:

### Tracing Observations
- **What Tracing Shows**: Tracing provides a detailed breadcrumb trail of the agent's execution. It records every message sent to the LLM, every tool call (including arguments and returned values), and every handoff between agents.
- **Debugging Value**: Without tracing, debugging a multi-agent system is "black-box." Tracing allows developers to see exactly *where* a handoff failed or *why* an agent hallucinated a tool call.
- **Operational Reality**: In this project, tracing was disabled globally because the SDK defaults to OpenAI's internal tracing servers. Since we are using an OpenRouter key, these background telemetry requests result in `401 Unauthorized` errors.

### Personal Implementation Notes (The "Smart Fallback")
One unique challenge on OpenRouter is the flakiness of specific free model endpoints. To combat this, I implemented a custom **"Smart Fallback"** logic within the `Model` interface wrap.
- When an agent requests a specific model (e.g., `Gemma 3`) and OpenRouter returns a `404 Not Found`, the system automatically catches the error and retries with `openrouter/auto`.
- This ensures the agentic loop is never broken by transient API issues, which is critical for autonomous agents.
