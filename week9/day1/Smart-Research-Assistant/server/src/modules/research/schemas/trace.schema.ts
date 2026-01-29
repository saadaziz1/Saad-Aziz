import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ResearchTrace extends Document {
    @Prop({ required: true })
    query: string;

    @Prop({ type: [String] })
    subQueries: string[];

    @Prop({ type: [Object] })
    documents: any[];

    @Prop({ type: [Object] })
    rankedDocs: any[];

    @Prop({ type: [Object] })
    summaries: any[];

    @Prop({ type: [Object] })
    contradictions: any[];

    @Prop()
    finalAnswer: string;

    @Prop({ type: Object })
    steps: {
        [key: string]: any;
    };
}

export const ResearchTraceSchema = SchemaFactory.createForClass(ResearchTrace);
