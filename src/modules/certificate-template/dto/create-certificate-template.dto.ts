import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsString } from 'class-validator';
import { InputJsonValue } from '@prisma/client/runtime/client';

export class CreateCertificateTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  templateUrl: string;

  @ApiProperty()
  @IsJSON()
  namePosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  courseNamePosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  courseDatePosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  certificateNumberPosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  durationPosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  pointsPosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  yearOfInclusionPosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  numberOfInclusionPosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  eventTypePosition: InputJsonValue;

  @ApiProperty()
  @IsJSON()
  certificateTypePosition: InputJsonValue;
}
