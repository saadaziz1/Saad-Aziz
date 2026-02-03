import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { AgentRunner } from '../agents/runner';
import { createProductSearchTool } from '../agents/tools/product-search.tool';
import { createProductRecommendationAgent } from '../agents/definitions/product-recommendation.agent';
import { createGeneralChatAgent } from '../agents/definitions/general-chat.agent';

@Injectable()
export class ChatService {
    private productRecommendationAgent: ReturnType<typeof createProductRecommendationAgent>;
    private generalChatAgent: ReturnType<typeof createGeneralChatAgent>;

    constructor(private productsService: ProductsService) {
        const productSearchTool = createProductSearchTool(productsService);
        this.productRecommendationAgent = createProductRecommendationAgent(productSearchTool);
        // Create general chat agent with handoff to product agent
        this.generalChatAgent = createGeneralChatAgent(this.productRecommendationAgent);
    }

    // For product-related queries (uses product search tool)
    async getProductRecommendations(message: string) {
        const result = await AgentRunner.run(this.productRecommendationAgent, message, {});

        // Extract keywords and find relevant products to display
        const keywords = this.productsService.extractKeywords(message);
        const products = await this.productsService.searchByKeywords(keywords);

        const formattedProducts = products.slice(0, 5).map((p: any) => ({
            _id: p._id?.toString() || p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            brand: p.brand,
            image: p.image,
        }));

        return {
            reply: result.finalOutput,
            products: formattedProducts,
            history: result.history,
        };
    }

    // For general conversation (restricted to store topics, with handoff)
    async generalChat(message: string) {
        const result = await AgentRunner.run(this.generalChatAgent, message, {});

        // The SDK handles handoffs automatically via the agent's handoffs configuration
        // Check history to see if handoff occurred or tool was used
        const handedOff = result.history.some((h: any) => h.event === 'handoff');
        const usedProductTool = result.history.some((h: any) => h.tool === 'search_products');

        // If product-related intent detected, fetch products
        let products: any[] = [];
        const isProductQuery = this.isProbablyProductQuery(message);

        console.log(`[ChatService] Analysis: handedOff=${handedOff}, usedTool=${usedProductTool}, isProductQuery=${isProductQuery}`);

        if (handedOff || usedProductTool || isProductQuery) {
            console.log(`[ChatService] Fetching products for query: "${message}"`);

            // Extract keywords to avoid searching for the full sentence
            const keywords = this.productsService.extractKeywords(message);
            console.log(`[ChatService] Extracted keywords: ${keywords.join(', ')}`);

            const searchResults = await this.productsService.searchByKeywords(keywords);
            console.log(`[ChatService] Found ${searchResults.length} products`);

            products = searchResults.slice(0, 5).map((p: any) => ({
                _id: p._id?.toString() || p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                brand: p.brand,
                image: p.image,
            }));
        }

        return {
            reply: result.finalOutput,
            products,
            handedOff,
            history: result.history,
        };
    }

    // Simple keyword check for product-related queries
    private isProbablyProductQuery(message: string): boolean {
        const productKeywords = [
            'vitamin', 'supplement', 'product', 'recommend', 'buy',
            'health', 'bone', 'heart', 'immune', 'energy', 'mineral',
            'calcium', 'iron', 'zinc', 'omega', 'protein', 'powder',
            'capsule', 'tablet', 'skin', 'hair', 'joint', 'sleep',
            'strength', 'weak', 'pain', 'diet', 'nutrition', 'pill'
        ];
        const lowerMessage = message.toLowerCase();
        return productKeywords.some(keyword => lowerMessage.includes(keyword));
    }
}
