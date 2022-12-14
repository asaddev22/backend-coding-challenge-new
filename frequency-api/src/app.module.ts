import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsModule } from './alerts/alerts.module';
import { FrequencyModule } from './frequency/frequency.module';

@Module({
  imports: [AlertsModule, FrequencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
