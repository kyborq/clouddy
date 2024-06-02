import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StorageDocument = Storage & Document;

@Schema()
export class Storage {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true, default: 0 })
  size: number;

  @Prop({ required: true, default: [] })
  tags: string[];

  @Prop()
  description: string;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
