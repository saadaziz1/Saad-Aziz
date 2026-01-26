import { tool } from '@openai/agents';
import { z } from 'zod';

export const sectionLocatorTool = tool({
    name: 'section_locator',
    description: 'Locates specific sections (e.g., Introduction, Methodology, Conclusion) in the document.',
    parameters: z.object({
        docId: z.string().describe('The database ID of the PDF document'),
        sectionName: z.string().describe('The name of the section to locate'),
    }),
    execute: async ({ docId, sectionName }, { context }: any) => {
        const documentsService = (context as any).documentsService;
        const doc = await documentsService.findById(docId);

        const lines = doc.content.split('\n');
        const sectionLower = sectionName.toLowerCase();

        // Find section with flexible matching
        let index = lines.findIndex(l => {
            const lineLower = l.toLowerCase().trim();
            return lineLower.includes(sectionLower) ||
                lineLower.startsWith(sectionLower) ||
                (lineLower.length < 100 && lineLower === sectionLower);
        });

        if (index === -1) {
            return {
                error: `Section "${sectionName}" not found in the document.`,
                suggestion: 'Try using chunk_retriever with keywords instead.'
            };
        }

        // Return more context: 20 lines after the header
        return {
            sectionHeader: lines[index],
            content: lines.slice(index + 1, index + 21).join('\n'),
            lineNumber: index + 1
        };
    },
});
