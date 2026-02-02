import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
    @Prop({ required: true, index: true })
    name: string;

    @Prop({ required: true, enum: ['test', 'odi', 't20'], index: true })
    format: string;

    @Prop({ type: Number, default: 0 })
    matches: number;

    @Prop({ type: Number, default: 0 })
    innings: number;

    @Prop({ type: Number, default: 0 })
    runs: number;

    @Prop({ type: String })
    highestScore: string;

    @Prop({ type: Number, default: 0 })
    average: number;

    @Prop({ type: Number, default: 0 })
    strikeRate: number;

    @Prop({ type: Number, default: 0 })
    hundreds: number;

    @Prop({ type: Number, default: 0 })
    fifties: number;

    @Prop({ type: Number, default: 0 })
    wickets: number;

    @Prop({ type: String })
    bestBowling: string;

    @Prop({ type: Object })
    metadata: Record<string, any>;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

// Text index for fuzzy name searching
PlayerSchema.index({ name: 'text' });
