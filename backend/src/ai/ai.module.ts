import { StorageModule } from 'src/storage/storage.module';

import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  providers: [AiService],
  controllers: [AiController],
  imports: [StorageModule],
})
export class AiModule {}
