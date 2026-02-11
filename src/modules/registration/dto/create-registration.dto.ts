import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { RegistrationType } from 'prisma/generated/enums';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  courseId: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RegistrationType)
  type?: RegistrationType;
}
