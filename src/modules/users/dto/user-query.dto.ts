import { Prisma } from 'prisma/generated/browser';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['name', 'email', 'phone', 'createdAt', 'role'])
  orderBy?: keyof Prisma.RegistrationOrderByWithRelationInput;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderType?: Prisma.SortOrder;
}
