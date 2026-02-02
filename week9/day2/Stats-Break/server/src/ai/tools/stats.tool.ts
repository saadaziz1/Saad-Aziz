import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * Zod Schema for Cricket Statistics Queries
 * Note: Uses .nullable() instead of .optional() to comply with OpenAI Structured Outputs (strict: true)
 */
export const QueryStatsSchema = z.object({
    collection: z.string().nullable().describe('The dynamic collection name to query (e.g. "odi_data", "match_summary").'),
    filter: z.record(z.string(), z.any()).describe('The MongoDB filter object (e.g. { name: "Virat Kohli" } or { venue: "Lord\'s" })'),
    projection: z.record(z.string(), z.number()).nullable().describe('Specific fields to include or exclude (e.g. { name: 1, runs: 1 }). Use this to return ONLY requested columns.'),
    sort: z.record(z.string(), z.number()).nullable().describe('Sort order (e.g. { runs: -1 }). Pass null if no sort is needed.'),
    limit: z.number().nullable().describe('Maximum number of results (default: 10). Pass null if no limit is needed.')
});

const DANGEROUS_OPERATORS = [
    '$where', '$expr', '$accumulator', '$function',
    '$rename', '$set', '$unset', '$project', '$group', '$mql'
];

function isSafeQuery(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return true;
    for (const key in obj) {
        if (typeof key === 'string' && DANGEROUS_OPERATORS.includes(key)) {
            return false;
        }
        if (!isSafeQuery(obj[key])) return false;
    }
    return true;
}

export const createStatsTool = (playersService: any) =>
    tool({
        name: 'query_cricket_stats',
        description: 'Query the cricket players database for statistics. Use this for ANY factual data. Support specific column selection via projection.',
        parameters: QueryStatsSchema,
        strict: true,
        execute: async (args: z.infer<typeof QueryStatsSchema>, context) => {
            console.log(`[StatsTool] Querying with args: ${JSON.stringify(args)}`);

            // Security Check: Block dangerous operators
            if (!isSafeQuery(args.filter)) {
                return JSON.stringify({ error: "Dangerous query operators detected. Query blocked." });
            }

            // Handle null values from Structured Outputs
            const collection = args.collection || 'players';
            const filter = args.filter || {};
            const projection = args.projection || {};
            const sort = args.sort || {};
            const limit = Math.min(args.limit || 10, 20); // Hard cap at 20

            const data = await playersService.executeQuery({
                collection,
                filter,
                projection,
                sort,
                limit
            });

            if (context && (context as any).context) {
                // @ts-ignore
                context.context.lastToolResult = data;
            }

            return JSON.stringify(data);
        }
    });
