import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { StorageService } from './storage.service';
import { Request, Response } from 'express';
import { UploadDto } from './dtos/upload.dto';

@Controller('storage')
@UseGuards(AccessTokenGuard)
export class StorageController {
  constructor(private minioService: StorageService) {}

  @Get()
  async getAllFiles(@Req() request: Request) {
    const userId = request.user['sub'];
    const files = await this.minioService.getAllFiles(userId);

    return files.map((file) => new UploadDto(file));
  }

  @Get('download/:name')
  async getFile(@Param('name') name: string, @Res() res: Response) {
    const file = await this.minioService.downloadFile(name);

    const fileRecord = await this.minioService.getFileRecord(name);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileRecord.alias}"`,
    );
    res.setHeader('Content-Type', fileRecord.mimeType);

    file.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['sub'];
    await this.minioService.uploadFile(file.buffer, file.originalname, userId);
    return { message: 'Successfully uploaded file' };
  }
}
