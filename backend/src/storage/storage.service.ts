import * as crypto from 'crypto';
import * as Minio from 'minio';
import { Model } from 'mongoose';
import { InjectMinio } from 'nestjs-minio';
import { Readable } from 'stream';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Upload, UploadDocument } from './schemas/file.schema';

@Injectable()
export class StorageService {
  private readonly mimeTypeMapping: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
  };
  private readonly bucketName: string;

  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    @InjectMinio() private readonly minioClient: Minio.Client,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');
  }

  private getMimeType(extension: string): string {
    return (
      this.mimeTypeMapping[extension.toLowerCase()] ||
      'application/octet-stream'
    );
  }

  private hashFileName(fileName: string): string {
    return crypto.createHash('sha256').update(fileName).digest('hex');
  }

  private createReadableStream(buffer: Buffer): Readable {
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(buffer);
    readableStream.push(null);
    return readableStream;
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    userId: string,
  ): Promise<void> {
    const hashedFileName = this.hashFileName(fileName);
    const readableStream = this.createReadableStream(buffer);
    const size = buffer.length / (1024 * 1024);
    const extension = fileName.split('.').pop();
    const uploadDate = new Date();
    const expirationDate = new Date(uploadDate.getTime() + 5 * 60000);
    const mimeType = this.getMimeType(extension);

    const upload = new this.uploadModel({
      alias: fileName,
      uploadDate,
      size,
      extension,
      expirationDate,
      fileName: hashedFileName,
      user: userId,
      mimeType,
    });

    try {
      await upload.save();
      await this.minioClient.putObject(
        this.bucketName,
        hashedFileName,
        readableStream,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file');
    }
  }

  async downloadFile(fileName: string) {
    const fileRecord = await this.uploadModel.findOne({ fileName }).exec();
    if (!fileRecord) {
      throw new NotFoundException('File not found.');
    }

    try {
      return await this.minioClient.getObject(this.bucketName, fileName);
    } catch (error) {
      throw new NotFoundException('Error retrieving file');
    }
  }

  async getFileRecord(fileName: string): Promise<UploadDocument> {
    const fileRecord = await this.uploadModel.findOne({ fileName }).exec();
    if (!fileRecord) {
      throw new NotFoundException('File record not found.');
    }
    return fileRecord;
  }

  async getAllFiles(userId: string): Promise<UploadDocument[]> {
    return this.uploadModel.find({ user: userId }).exec();
  }
}
