import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RawMaterial } from '../../raw-materials/schema/raw-material.schema';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class RecipeItem {
    @Prop({ type: Types.ObjectId, ref: 'RawMaterial', required: true })
    rawMaterial: Types.ObjectId | RawMaterial;

    @Prop({ required: true, min: 0.01 })
    quantity: number;
}

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    image: string;

    @Prop({ default: 0 })
    available: number;

    @Prop({ type: [RecipeItem], required: true })
    recipe: RecipeItem[];

    @Prop({ default: true })
    isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
