import { IsNumber, IsString } from 'class-validator';

export class CreateFrequencyDto {
  @IsNumber()
  samples: number;

  @IsNumber()
  frequency: number;

  @IsString()
  deviceId: string;
}
