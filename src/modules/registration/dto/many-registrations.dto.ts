import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManyRegistrationsDto {
  @ApiProperty()
  @IsArray()
  ids: number[];
}
