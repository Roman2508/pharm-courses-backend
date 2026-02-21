import { IsString, IsOptional } from 'class-validator';

export class RegistrationsUserQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
