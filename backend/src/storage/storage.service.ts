import { Response } from 'express';
import { Client } from 'minio';
import { Model } from 'mongoose';
import { InjectMinio } from 'nestjs-minio';
import { Readable } from 'stream';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { StorageDto } from './dtos/storage.dto';
import { Storage, StorageDocument } from './schemas/storage.schema';

@Injectable()
export class StorageService {
  private readonly bucketName: string;

  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    @InjectMinio() private readonly minioClient: Client,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME');
  }

  private toStorageDto(storage: StorageDocument): StorageDto | null {
    return (
      storage && {
        id: storage.id,
        fileName: storage.fileName,
        size: storage.size,
        tags: storage.tags,
        description: storage.description,
      }
    );
  }

  async createIfNoBucket() {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  async getFile(fileName: string) {
    const file = await this.storageModel.findOne({ fileName });
    return this.toStorageDto(file);
  }

  async listFiles() {
    const files = await this.storageModel.find();
    return files.map(this.toStorageDto);
  }

  async saveFile(fileName: string, size: number) {
    const existed = await this.getFile(fileName);
    if (existed) return;

    const storedFile = new this.storageModel({ fileName, size });
    await storedFile.save();
  }

  async downloadFile(fileName: string) {
    const existedFile = await this.getFile(fileName);
    if (!existedFile) {
      throw new NotFoundException();
    }

    const stream = await this.minioClient.getObject(this.bucketName, fileName);
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async uploadFile(file: Express.Multer.File) {
    await this.createIfNoBucket();

    const objectName = file.originalname;

    this.minioClient.putObject(
      this.bucketName,
      objectName,
      file.buffer,
      async (error) => {
        if (error) return;
        await this.saveFile(objectName, file.size);
      },
    );
  }

  async deleteFile(fileName: string) {
    const file = await this.getFile(fileName);
    if (!file) {
      throw new NotFoundException();
    }

    await this.storageModel.findByIdAndDelete(file.id);
    await this.minioClient.removeObject(this.bucketName, file.fileName);
  }
}
