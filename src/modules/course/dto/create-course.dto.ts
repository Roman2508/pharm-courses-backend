import {
  IsEnum,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsDateString,
} from 'class-validator';
import {
  CourseStatus,
  CourseTargetAudience,
  CourseRegistrationStatus,
} from 'prisma/generated/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxMembers?: number;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @ApiProperty()
  @IsEnum(CourseRegistrationStatus)
  registrationOpen: CourseRegistrationStatus;

  @ApiProperty()
  @IsEnum(CourseTargetAudience)
  targetAudience: CourseTargetAudience;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  certificateTemplateId?: number;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNumber()
  pointsBpr: number;

  @ApiProperty()
  @IsNumber()
  yearOfInclusionToBpr: number;

  @ApiProperty()
  @IsNumber()
  numberOfInclusionToBpr: number;
}
