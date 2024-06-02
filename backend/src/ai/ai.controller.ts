import { Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('image-caption/:fileName')
  async getImageCaption(@Param('fileName') fileName: string) {
    return await this.aiService.getImageCaption(fileName);
  }

  @Post('video-caption/:fileName')
  @UseInterceptors(FileInterceptor('file'))
  async getVideoCaption(@Param('fileName') fileName: string) {
    return this.aiService.getVideoCaption(fileName);
  }
}
