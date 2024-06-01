import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type UploadDocument = Upload & Document;

@Schema()
export class Upload {
  @Prop({ required: true })
  alias: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  uploadDate: Date;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true, default: false })
  isAvailable: boolean;

  @Prop({ required: true, default: 1 })
  version: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  mimeType: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
