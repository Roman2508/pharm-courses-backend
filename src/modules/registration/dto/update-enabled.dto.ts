import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean } from 'class-validator';

export class ChangeEnableCertificateDto {
  @ApiProperty()
  @IsArray()
  ids: number[];

  @ApiProperty()
  @IsBoolean()
  certificateEnabled: boolean;
}
