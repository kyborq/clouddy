import { StorageService } from 'src/storage/storage.service';
import { Readable } from 'stream';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly hfEndpoint: string;
  private readonly hfToken: string;
  private readonly videoCaptionEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
  ) {
    this.hfEndpoint = this.configService.get<string>('HF_IMAGE_CAPTION');
    this.hfToken = this.configService.get<string>('HF_TOKEN');
    this.videoCaptionEndpoint = 'http://localhost:5000/video-caption';
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  async getImageCaption(fileName: string) {
    // try {
    //   const imageStream = await this.storageService.downloadFile(fileName);
    //   const imageBuffer = await this.streamToBuffer(imageStream);
    //   const response = await fetch(this.hfEndpoint, {
    //     headers: {
    //       Authorization: `Bearer ${this.hfToken}`,
    //       'Content-Type': 'application/octet-stream',
    //     },
    //     method: 'POST',
    //     body: imageBuffer,
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     return result[0].generated_text;
    //   } else {
    //     throw new InternalServerErrorException('Error getting image caption');
    //   }
    // } catch (error) {
    //   console.log(error);
    //   throw new InternalServerErrorException('Error processing image caption');
    // }
  }

  async getVideoCaption(fileName: string) {
    // try {
    //   const videoStream = await this.storageService.downloadFile(fileName);
    //   const videoBuffer = await this.streamToBuffer(videoStream);
    //   const response = await fetch(this.videoCaptionEndpoint, {
    //     headers: {
    //       'Content-Type': 'application/octet-stream',
    //     },
    //     method: 'POST',
    //     body: videoBuffer,
    //   });
    //   const result = await response.json();
    //   if (response.ok) {
    //     return result.caption;
    //   } else {
    //     throw new InternalServerErrorException('Error getting video caption');
    //   }
    // } catch (error) {
    //   console.log(error);
    //   throw new InternalServerErrorException('Error processing video caption');
    // }
  }
}
