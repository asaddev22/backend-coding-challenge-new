import { Injectable, Logger } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  create(createAlertDto: CreateAlertDto[]) {
    this.logger.log('Received Alert', createAlertDto);
    return {
      message: 'Created Alerts!',
      responseCode: 201,
    };
  }
}
