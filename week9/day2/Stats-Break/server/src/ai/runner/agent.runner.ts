import { Runner } from '@openai/agents';

export class AgentRunner {
    static async run(agent: any, query: string, context: Record<string, any>, modelProvider?: any) {
        console.log(`[AgentRunner] Executing query: ${query}`);

        const runner = new Runner({ modelProvider } as any);
        const history: any[] = [];

        runner.on('agent_start', (ctx, agent) => {

            history.push({ role: 'assistant', name: agent.name, event: 'agent_start' });
            console.log(`>>> [Agent Start] ${agent.name}`);
        });

        runner.on('agent_handoff', (ctx, from, to) => {
            history.push({ role: 'assistant', event: 'handoff', from: from.name, to: to.name });
            console.log(`<<< [Handoff] ${from.name} -> ${to.name}`);
        });

        runner.on('agent_tool_start', (ctx, agent, tool) => {
            history.push({ role: 'assistant', name: agent.name, event: 'tool_start', tool: tool.name });
            console.log(`    [Tool Start] ${tool.name}`);
        });

        const result = await runner.run(agent, query, {
            context: context as any,
            maxTurns: 10
        });

        // Log Token Usage
        let usage: any = null;

        // Attempt to find usage in various locations based on SDK internals
        if ((result as any)) {
            usage = (result as any).state?._context?.usage;
        }

        if (usage) {
            console.log('----------------------------------------');
            console.log('📊 Token Usage Report:');
            console.log(`   • Total Tokens:      ${usage.totalTokens}`);
            console.log('----------------------------------------');
        } else {
            console.warn('[AgentRunner] No token usage data returned from provider.');
        }

        return {
            finalOutput: result.finalOutput,
            history,
            usage
        };
    }
}
