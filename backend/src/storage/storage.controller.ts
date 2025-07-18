import { Response } from 'express';

import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get()
  async listFiles() {
    return await this.storageService.listFiles();
  }

  @Get(':fileName')
  async getFile(@Param('fileName') fileName: string) {
    return await this.storageService.getFile(fileName);
  }

  @Get('download/:fileName')
  async downloadFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const fileBuffer = await this.storageService.downloadFile(fileName);
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Content-Length': fileBuffer.length,
      });
      res.end(fileBuffer);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.storageService.uploadFile(file);
  }

  @Delete(':fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    return await this.storageService.deleteFile(fileName);
  }
}
