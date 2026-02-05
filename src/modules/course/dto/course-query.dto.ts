import { IsOptional, IsString } from 'class-validator';

export class CourseQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
