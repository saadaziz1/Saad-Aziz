import { Controller, Get, Param, Query, Post, Body, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { AgentRunner } from '../agents/runner';
import { createProductSearchTool } from '../agents/tools/product-search.tool'
import { createProductRecommendationAgent } from '../agents/definitions/product-recommendation.agent';

@Controller('products')
export class ProductsController {
    private productRecommendationAgent: ReturnType<typeof createProductRecommendationAgent>;

    constructor(private readonly productsService: ProductsService) {
        const productSearchTool = createProductSearchTool(productsService);
        this.productRecommendationAgent = createProductRecommendationAgent(productSearchTool);
    }

    @Get()
    async findAll(
        @Query('q') query: string,
        @Query('ai') ai: string,
    ) {
        // If AI search is enabled, use the recommendation agent
        // If AI search is enabled, use the recommendation agent
        if (ai === 'true' && query) {
            const result = await AgentRunner.run(this.productRecommendationAgent, query, {});

            // Extract keywords and find relevant products to display
            const keywords = this.productsService.extractKeywords(query);
            let products = await this.productsService.searchByKeywords(keywords);

            return {
                products,
                explanation: result.finalOutput,
                history: result.history,
            };
        }

        // Otherwise, do a normal text search
        const products = await this.productsService.findAll(query);
        return { products, explanation: null };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        const product = await this.productsService.findOne(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    @Post('seed')
    seed(@Body() products: Partial<Product>[]) {
        return this.productsService.seedProducts(products);
    }
}
