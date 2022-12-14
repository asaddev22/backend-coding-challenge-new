import { Module } from '@nestjs/common';
import { FrequencyService } from './frequency.service';
import { FrequencyController } from './frequency.controller';

@Module({
  controllers: [FrequencyController],
  providers: [FrequencyService],
})
export class FrequencyModule {}
