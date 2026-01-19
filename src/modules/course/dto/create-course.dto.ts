import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CourseStatus } from 'prisma/generated/enums';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  description: any;

  @ApiProperty()
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @ApiProperty()
  @IsBoolean()
  registrationOpen: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  certificateTemplateId?: number;
}
