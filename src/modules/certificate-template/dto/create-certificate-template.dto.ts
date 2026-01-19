import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsJSON, IsString } from 'class-validator';
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
  @IsBoolean()
  isGlobal: boolean;
}
