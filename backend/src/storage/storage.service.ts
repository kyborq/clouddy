import * as Minio from 'minio';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { InjectModel } from '@nestjs/mongoose';
import { Upload, UploadDocument } from './schemas/file.schema';
import { Model } from 'mongoose';
import { InjectMinio } from 'nestjs-minio';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    @InjectMinio() private readonly minioClient: Minio.Client,
  ) {}

  private readonly mimeTypeMapping: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
  };

  private getMimeType(extension: string): string {
    return (
      this.mimeTypeMapping[extension.toLowerCase()] ||
      'application/octet-stream'
    );
  }

  hashFileName(fileName: string): string {
    return crypto.createHash('sha256').update(fileName).digest('hex');
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    userId: string,
  ): Promise<void> {
    const readableStream: Readable = new Readable();
    readableStream._read = () => {};
    readableStream.push(buffer);
    readableStream.push(null);

    const hashedFileName = this.hashFileName(fileName);
    const size = buffer.length / (1024 * 1024);
    const extension = fileName.split('.').pop();
    const uploadDate = new Date();
    const expirationDate = new Date(uploadDate.getTime() + 5 * 60000);
    const mimeType = this.getMimeType(extension);

    const upload = await this.uploadModel.create({
      alias: fileName,
      uploadDate: uploadDate,
      size,
      extension,
      expirationDate,
      fileName: hashedFileName,
      user: userId,
      mimeType,
    });
    upload.save();
    await this.minioClient.putObject('reshare', hashedFileName, readableStream);
  }

  async downloadFile(fileName: string) {
    const fileRecord = await this.uploadModel.findOne({ fileName }).exec();
    if (!fileRecord) {
      throw new Error('File not found.');
    }

    // const now = new Date();
    // if (now > fileRecord.expirationDate) {
    //   throw new Error('File has expired.');
    // }

    return await this.minioClient.getObject('reshare', fileName);
  }

  async getFileRecord(fileName: string): Promise<UploadDocument> {
    const fileRecord = await this.uploadModel.findOne({ fileName }).exec();

    if (!fileRecord) {
      throw new Error('File record not found.');
    }

    return fileRecord;
  }

  async getAllFiles(userId: string) {
    const result = await this.uploadModel
      .find({
        user: userId,
      })
      .exec();

    return result;
  }
}
