import { Controller, Post, Body } from '@nestjs/common';
import { FrequencyService } from './frequency.service';
import { ParseArrayPipe } from '@nestjs/common/pipes';

import { CreateFrequencyDto } from './dto/create-frequency.dto';

@Controller('Frequency')
export class FrequencyController {
  constructor(private readonly frequencyService: FrequencyService) {}

  @Post()
  createBulk(
    @Body(new ParseArrayPipe({ items: CreateFrequencyDto }))
    createFrequencyDtos: CreateFrequencyDto[],
  ) {
    return this.frequencyService.create(createFrequencyDtos);
  }
}
