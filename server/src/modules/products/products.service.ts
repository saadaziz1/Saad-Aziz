import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RawMaterial, RawMaterialDocument } from '../raw-materials/schema/raw-material.schema';

import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterialDocument>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async create(createProductDto: CreateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
        let imageUrl = '';
        if (imageFile) {
            const uploadResult = await this.cloudinaryService.uploadFile(imageFile);
            imageUrl = uploadResult.secure_url;
        }

        const recipe = await this.parseRecipe(createProductDto.recipe);

        const productData = {
            ...createProductDto,
            image: imageUrl,
            recipe: recipe,
            isActive: createProductDto.isActive ?? true,
        };

        const newProduct = new this.productModel(productData);
        return newProduct.save();
    }

    async findAll(filter?: { category?: string }): Promise<any[]> {
        const query: any = {};
        if (filter?.category) {
            query.category = filter.category;
        }

        const products = await this.productModel.find(query).populate('recipe.rawMaterial').exec();

        // Calculate availability for each product
        const productsWithAvailability = products.map(product => {
            const availability = this.calculateAvailability(product);
            return {
                ...product.toObject(),
                availability,
            };
        });

        return productsWithAvailability;
    }

    async findOne(id: string): Promise<any> {
        const product = await this.productModel.findById(id).populate('recipe.rawMaterial').exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const availability = this.calculateAvailability(product);
        return {
            ...product.toObject(),
            availability,
        };
    }

    async update(id: string, updateProductDto: UpdateProductDto, imageFile?: Express.Multer.File): Promise<Product> {
        const updateData: any = {};
        if (updateProductDto.name !== undefined) updateData.name = updateProductDto.name;
        if (updateProductDto.price !== undefined) updateData.price = Number(updateProductDto.price);
        if (updateProductDto.category !== undefined) updateData.category = updateProductDto.category;

        // Handle isActive explicitly for robust type conversion
        if (updateProductDto.isActive !== undefined) {
            // Explicit conversion: only "true" or true (boolean) become true.
            // Everything else (like "false", false, 0, "0") becomes false.
            updateData.isActive = (updateProductDto.isActive === true || String(updateProductDto.isActive).toLowerCase() === 'true' || String(updateProductDto.isActive) === '1');
        }

        if (imageFile) {
            const uploadResult = await this.cloudinaryService.uploadFile(imageFile);
            updateData.image = uploadResult.secure_url;
        }

        // Always check if recipe is provided, even if empty array
        if (updateProductDto.recipe !== undefined) {
            updateData.recipe = await this.parseRecipe(updateProductDto.recipe);
        }

        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return updatedProduct;
    }

    async remove(id: string): Promise<void> {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    async findByRawMaterial(rawMaterialId: string): Promise<Product[]> {
        return this.productModel.find({
            'recipe.rawMaterial': new Types.ObjectId(rawMaterialId),
            isActive: true
        }).exec();
    }

    async deactivateByRawMaterial(rawMaterialId: string): Promise<void> {
        await this.productModel.updateMany(
            { 'recipe.rawMaterial': new Types.ObjectId(rawMaterialId) },
            { isActive: false }
        ).exec();
    }

    private calculateAvailability(product: ProductDocument): number {
        if (!product.recipe || product.recipe.length === 0) return 0;

        let minAvailability = Infinity;

        for (const item of product.recipe) {
            const rawMaterial = item.rawMaterial as RawMaterial;
            if (!rawMaterial) return 0; // If raw material is not populated or missing

            const possibleUnits = Math.floor(rawMaterial.stockQty / item.quantity);
            if (possibleUnits < minAvailability) {
                minAvailability = possibleUnits;
            }
        }

        return minAvailability === Infinity ? 0 : minAvailability;
    }

    async validateStock(productId: string, quantity: number): Promise<boolean> {
        const product = await this.productModel.findById(productId).populate('recipe.rawMaterial').exec();
        if (!product) return false;

        const availability = this.calculateAvailability(product);
        return availability >= quantity;
    }

    private async parseRecipe(recipeData: any): Promise<any[]> {
        if (!recipeData) return [];

        let recipe: any[] = [];
        try {
            recipe = typeof recipeData === 'string' ? JSON.parse(recipeData) : recipeData;
        } catch (e) {
            throw new BadRequestException('Invalid recipe format. Expected JSON string or array.');
        }

        if (!Array.isArray(recipe)) return [];

        const validatedRecipe: any[] = [];
        const rawMaterialIdsToVerify: string[] = [];

        for (const item of recipe) {
            let rawMaterialId = '';
            if (typeof item.rawMaterial === 'object' && item.rawMaterial !== null) {
                rawMaterialId = item.rawMaterial._id || item.rawMaterial.id;
            } else {
                rawMaterialId = String(item.rawMaterial);
            }

            if (!rawMaterialId || rawMaterialId === 'undefined' || rawMaterialId === 'null') continue;

            const quantity = Number(item.quantity);
            if (isNaN(quantity) || quantity <= 0) continue;

            validatedRecipe.push({
                rawMaterial: new Types.ObjectId(rawMaterialId),
                quantity: quantity
            });
            rawMaterialIdsToVerify.push(rawMaterialId);
        }

        // Verification of existence (User's point about rawMaterialModel)
        if (rawMaterialIdsToVerify.length > 0) {
            const uniqueIds = [...new Set(rawMaterialIdsToVerify)];
            const existingMaterials = await this.rawMaterialModel.find({
                _id: { $in: uniqueIds.map(id => new Types.ObjectId(id)) }
            }).exec();

            if (existingMaterials.length !== uniqueIds.length) {
                const foundIds = existingMaterials.map(m => m._id.toString());
                const missingIds = uniqueIds.filter(id => !foundIds.includes(String(id)));
                throw new BadRequestException(`Raw materials not found: ${missingIds.join(', ')}`);
            }
        }

        return validatedRecipe;
    }
}
