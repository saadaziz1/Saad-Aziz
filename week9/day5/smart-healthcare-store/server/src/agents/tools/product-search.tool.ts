import { tool } from '@openai/agents';
import { z } from 'zod';
import { ProductsService } from '../../products/products.service';

/**
 * Create the product search tool using the SDK's tool function
 */
export const createProductSearchTool = (productsService: ProductsService) => {
    return tool({
        name: 'search_products',
        description: 'Search for healthcare products in the store catalog based on a query. Returns matching products with their details.',
        parameters: z.object({
            query: z.string().describe('The search query for finding products (e.g., "vitamins", "protein supplements", "pain relief")'),
        }),
        execute: async ({ query }) => {
            console.log(`[ProductSearchTool] Searching for: ${query}`);
            const products = await productsService.findAll(query);
            return products.map((p: any) => ({
                id: p._id?.toString() || p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
            }));
        },
    });
};
