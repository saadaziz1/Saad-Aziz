import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawMaterialDocument = RawMaterial & Document;

export enum RawMaterialUnit {
    GRAM = 'g',
    ML = 'ml',
    PCS = 'pcs',
}

@Schema({ timestamps: true })
export class RawMaterial {
    @Prop({ required: true, unique: true, trim: true })
    name: string;

    @Prop({ required: true, enum: RawMaterialUnit })
    unit: RawMaterialUnit;

    @Prop({ required: true, min: 0 })
    stockQty: number;

    @Prop({ default: 0, min: 0 })
    minAlertQty: number;
}

export const RawMaterialSchema =
    SchemaFactory.createForClass(RawMaterial);
