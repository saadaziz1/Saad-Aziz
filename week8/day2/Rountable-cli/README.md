# Agentic Roundtable Discussion App

A multi-agent CLI system built with the OpenAI Agents SDK.

## Features
- **Moderated Orchestration**: A Moderator agent (Router) decides which expert should speak.
- **Specialized Experts**: Tech, Business, and Ethics agents with distinct personas.
- **Handoff Mechanism**: Dynamic delegation between agents.
- **Guardrails**: Safety checks to ensure appropriate discussion topics.
- **Tools**: Automated word counting and fact detection.
- **Observability**: Real-time tracing of agent starts, tool calls, and handoffs.

## Setup Instructions

1.  **Clone the project**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root with your API key:
    ```env
    OPENAI_API_KEY=your_key_here
    ```
4.  **Run the App**:
    ```bash
    npx tsx src/index.ts
    ```

## Agent Roles
- **Moderator**: Orchestrates the flow. Does not provide direct answers.
- **Tech Expert**: Focuses on technical architecture and feasibility.
- **Business Expert**: Focuses on market trends and economic impact.
- **Ethics Expert**: Focuses on social responsibility and ethics.

## Tools & Handoffs
- **Word Limiter**: Ensures expert responses are concise.
- **Fact Counter**: Heuristic-based claim detection.
- **Handoff Flow**: User -> Moderator -> [Expert 1 -> Moderator -> Expert 2] -> Moderator (Final).

## Why Agentic AI?
Unlike single-prompt LLMs, this system:
1.  **Separates Concerns**: Each agent is a specialist in its domain.
2.  **Reduces Hallucinations**: Tools provide factual constraints.
3.  **Enables Scale**: New experts can be added without modifying the moderator's core logic.
