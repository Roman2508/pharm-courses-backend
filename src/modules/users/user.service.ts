import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from 'prisma/generated/client';
import { UserQueryDto } from './dto/user-query.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // findAll(query: UserQueryDto) {
  //   const page = Number(query.page ?? 1);
  //   const limit = Number(query.limit ?? 20);

  //   const where: Prisma.UserWhereInput = {};

  //   if (query.search) {
  //     const search = query.search.trim();

  //     where.OR = [
  //       { name: { contains: search, mode: 'insensitive' } },
  //       { email: { contains: search, mode: 'insensitive' } },
  //       { phone: { contains: search.replace(/\s/g, ''), mode: 'insensitive' } },
  //     ];
  //   }

  //   let orderBy: Prisma.UserOrderByWithRelationInput = {};

  //   if (query.orderBy && query.orderType) {
  //     const [relation, field] = query.orderBy.split('.');

  //     if (field) {
  //       orderBy = { [relation]: { [field]: query.orderType } };
  //     } else {
  //       orderBy = { [query.orderBy]: query.orderType };
  //     }
  //   }

  //   let skip = 0;

  //   if (page && limit) {
  //     skip = (page - 1) * limit;
  //   }

  //   return this.prisma.user.findMany({
  //     where,
  //     orderBy,
  //     take: limit,
  //     skip: (page - 1) * limit,
  //   });
  // }

  // async update(id: string, dto: UpdateUserDto) {
  //   if (dto.email) {
  //     const existingEmail = await this.prisma.user.findFirst({
  //       where: {
  //         email: dto.email,
  //         NOT: { id },
  //       },
  //     });
  //     if (existingEmail) {
  //       throw new ConflictException('Такий Email вже зареєстрований');
  //     }
  //   }

  //   const data: UpdateUserDto = { ...dto };

  //   if (dto.password) {
  //     data.password = await bcrypt.hash(dto.password, 10);
  //   }

  //   return this.prisma.user.update({ where: { id }, data });
  // }
}
