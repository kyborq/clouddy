import { NestMinioModule } from 'nestjs-minio';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Storage, StorageSchema } from './schemas/storage.schema';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
        port: Number(configService.getOrThrow('MINIO_PORT')),
        useSSL: configService.getOrThrow('MINIO_USE_SSL') === 'true',
        accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
      }),
    }),
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
