import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) { }

    // Basic text search - no AI logic here
    async findAll(query: string = ''): Promise<Product[]> {
        if (!query) {
            return this.productModel.find().exec();
        }

        return this.productModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } },
            ],
        }).exec();
    }

    async findOne(id: string): Promise<Product | null> {
        return this.productModel.findById(id).exec();
    }

    // Search by multiple keywords (used by the AI agent after extracting keywords)
    async searchByKeywords(keywords: string[]): Promise<Product[]> {
        if (!keywords || keywords.length === 0) {
            return [];
        }

        return this.productModel.find({
            $or: keywords.flatMap(k => [
                { name: { $regex: k, $options: 'i' } },
                { description: { $regex: k, $options: 'i' } },
                { category: { $regex: k, $options: 'i' } },
                { tags: { $in: [new RegExp(k, 'i')] } },
            ])
        }).limit(10).exec();
    }

    // Seed dummy data
    async seedProducts(products: Partial<Product>[]) {
        await this.productModel.deleteMany({});
        return this.productModel.insertMany(products);
    }

    // Shared keyword extraction logic
    extractKeywords(query: string): string[] {
        const stopWords = ['i', 'have', 'need', 'want', 'for', 'my', 'the', 'a', 'an', 'and', 'or', 'with', 'to', 'help', 'me', 'recommend', 'show', 'is', 'are', 'do', 'does', 'can', 'please', 'product', 'products'];
        return query
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));
    }
}
