import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
    @Prop({ required: true, index: true })
    team1: string;

    @Prop({ required: true, index: true })
    team2: string;

    @Prop({ required: true, enum: ['test', 'odi', 't20'], index: true })
    format: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    venue: string;

    @Prop({ required: true })
    result: string;

    @Prop({ type: Object })
    metadata: Record<string, any>;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

MatchSchema.index({ team1: 'text', team2: 'text', venue: 'text', result: 'text' });
