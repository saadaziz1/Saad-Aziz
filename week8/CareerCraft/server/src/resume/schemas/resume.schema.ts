import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  title?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  summary?: string;

  @Prop({ type: [Object], default: [] })
  education: Array<{
    school?: string;
    degree?: string;
    startYear?: string;   // ✅ changed from startDate
    endYear?: string;     // ✅ changed from endDate
    description?: string;
  }>;

  @Prop({ type: [Object], default: [] })
  experience: Array<{
    company?: string;
    role?: string;        // ✅ changed from position
    startDate?: string;
    endDate?: string;
    description?: string; // ✅ added instead of responsibilities
  }>;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [Object], default: [] })
  projects: Array<{
    name?: string;
    url?: string;         // ✅ changed from link
    description?: string; // ✅ changed from summary
  }>;

  @Prop({ type: [String], default: [] })
  certifications: string[]; // ✅ added

  @Prop({ type: [String], default: [] })
  languages: string[];      // ✅ added

  @Prop()
  templateId?: string;

  @Prop({ type: Object, default: {} })
  meta?: any;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
