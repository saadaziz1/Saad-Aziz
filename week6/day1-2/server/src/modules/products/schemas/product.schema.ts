import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductCategory, ProductSize, DressStyle, ProductColor, ProductType, PurchaseType } from '../../../common/enums/product-attributes.enum';

/**
 * MongoDB document type for Product
 */
export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {

    /**
     * Product name
     */
    @Prop({ required: true })
    name: string;

    /**
     * Product description
     */
    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 0 })
    pointsPrice: number;

    @Prop({ default: 0 })
    stock: number;

    @Prop({ default: 0 })
    totalStock: number; // For progress bar tracking (stock / totalStock)

    @Prop({ default: 0 })
    sales: number; // Track total units sold

    @Prop({ default: '' })
    brand: string;

    @Prop({ unique: true, sparse: true })
    sku: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ required: true, type: String, enum: ProductCategory })
    category: ProductCategory;

    @Prop({ type: String, enum: ProductType })
    type: ProductType;

    @Prop({ type: [String], enum: ProductColor, default: [] })
    colors: ProductColor[];

    @Prop({ type: [String], enum: ProductSize, default: [] })
    sizes: ProductSize[];

    @Prop({ type: String, enum: DressStyle, required: true })
    dressStyle: DressStyle;

    @Prop({ type: [String], default: [] })
    images: string[]; // URLs from Cloudinary

    @Prop({ type: String, enum: PurchaseType, default: PurchaseType.MONEY_ONLY })
    purchaseType: PurchaseType;

    @Prop({ default: 0 })
    discountPercentage: number;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: false })
    isOnSale: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
