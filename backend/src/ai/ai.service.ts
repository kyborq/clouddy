import { StorageService } from 'src/storage/storage.service';
import { Readable } from 'stream';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly apiAI: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
  ) {
    this.apiAI = this.configService.get<string>('AI_SERVICE_API');
  }

  async getImageCaption(fileName: string) {
    const fileBuffer = await this.storageService.downloadFile(fileName);
    const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);

    try {
      const response = await fetch(`${this.apiAI}/image-caption`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new InternalServerErrorException(
          'Error generating image caption',
        );
      }
      const caption = await response.text();
      return caption;
    } catch (error) {
      throw new InternalServerErrorException('Error generating image caption');
    }
  }

  async getVideoCaption(fileName: string) {}
}
