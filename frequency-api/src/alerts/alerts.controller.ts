import { Controller, Post, Body } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { ParseArrayPipe } from '@nestjs/common/pipes';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  createBulk(
    @Body(new ParseArrayPipe({ items: CreateAlertDto }))
    createAlertDtos: CreateAlertDto[],
  ) {
    return this.alertsService.create(createAlertDtos);
  }
}
