import { IsString } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  status: string;

  @IsString()
  deviceId: string;
}
