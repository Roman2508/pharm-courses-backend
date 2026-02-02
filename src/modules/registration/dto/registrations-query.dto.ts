import { Prisma } from 'prisma/generated/browser';
import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class RegistrationsQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsIn([
    'createdAt',
    'course.name',
    'user.name',
    'amount',
    'certificateEnabled',
  ])
  orderBy?: keyof Prisma.RegistrationOrderByWithRelationInput;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderType?: Prisma.SortOrder;
}
