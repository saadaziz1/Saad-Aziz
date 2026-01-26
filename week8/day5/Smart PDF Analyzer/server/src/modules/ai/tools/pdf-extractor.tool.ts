import { tool } from '@openai/agents';
import { z } from 'zod';

export const pdfExtractorTool = tool({
    name: 'pdf_extractor',
    description: 'Extracts the full text content from a PDF document stored in the system.',
    parameters: z.object({
        docId: z.string().describe('The database ID of the PDF document'),
    }),
    execute: async ({ docId }, { context }: any) => {
        const documentsService = (context as any).documentsService;
        const doc = await documentsService.findById(docId);
        return { content: doc.content };
    },
});
