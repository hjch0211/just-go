import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop()
  userAgent: string;

  @Prop()
  ip: string;

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date, default: Date.now })
  lastActivityAt: Date;

  @Prop({ default: 0 })
  duration: number; // in milliseconds

  @Prop({ default: 0 })
  eventCount: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Index for faster queries
SessionSchema.index({ projectId: 1, startedAt: -1 });
SessionSchema.index({ sessionId: 1 });
