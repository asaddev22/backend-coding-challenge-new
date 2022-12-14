import { Injectable, Logger } from '@nestjs/common';
import { CreateFrequencyDto } from './dto/create-frequency.dto';

@Injectable()
export class FrequencyService {
  private readonly logger = new Logger(FrequencyService.name);

  create(createFrequencyDtos: CreateFrequencyDto[]) {
    this.logger.log('Received Frequency', createFrequencyDtos);
    return {
      message: 'Frequencies Received!',
      responseCode: 201,
    };
  }
}
