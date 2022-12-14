import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';

describe('AlertsController', () => {
  let controller: AlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [AlertsService],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a response message when successful', () => {
    const responseMessage = controller.createBulk([
      {
        status: 'ok',
        deviceId: 'device1',
      },
    ]);
    expect(responseMessage).toEqual({
      message: 'Created Alerts!',
      responseCode: 201,
    });
  });
});
