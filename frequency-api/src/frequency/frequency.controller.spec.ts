import { Test, TestingModule } from '@nestjs/testing';
import { FrequencyController } from './frequency.controller';
import { FrequencyService } from './frequency.service';

describe('FrequencyController', () => {
  let controller: FrequencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrequencyController],
      providers: [FrequencyService],
    }).compile();

    controller = module.get<FrequencyController>(FrequencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a response message when successful', () => {
    const responseMessage = controller.createBulk([
      {
        frequency: 10.1231312313123,
        samples: 60,
        deviceId: 'device1',
      },
    ]);
    expect(responseMessage).toEqual({
      message: 'Frequencies Received!',
      responseCode: 201,
    });
  });
});
