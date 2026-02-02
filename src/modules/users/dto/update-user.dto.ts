import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  role: 'user' | 'admin';

  @ApiProperty()
  @IsString()
  region_city: string;

  @ApiProperty()
  @IsString()
  education: string;

  @ApiProperty()
  @IsString()
  specialty: string;

  @ApiProperty()
  @IsString()
  workplace: string;

  @ApiProperty()
  @IsString()
  jobTitle: string;
}
