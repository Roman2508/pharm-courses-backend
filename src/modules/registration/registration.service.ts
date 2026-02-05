import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import path from 'path';
import * as fs from 'node:fs/promises';

import { auth } from 'src/shared/lib/auth';
import { Prisma } from 'prisma/generated/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ChangeEnableCertificateDto } from './dto/update-enabled.dto';
import { RegistrationsQueryDto } from './dto/registrations-query.dto';
import { UpdateRegistrationPaymentDto } from './dto/update-registration.dto';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        courseId_userId: { userId: dto.userId, courseId: dto.courseId },
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('Ви вже зареєстровані на цей захід');
    }

    return this.prisma.registration.create({ data: dto });
  }

  async createForFree(dto: CreateRegistrationDto) {
    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        courseId_userId: { userId: dto.userId, courseId: dto.courseId },
      },
    });

    if (existingRegistration) {
      throw new BadRequestException(
        'Повторна реєстрація на цей захід недоступна',
      );
    }

    return this.prisma.registration.create({
      data: { ...dto, paymentStatus: 'PAID' },
    });
  }

  async findAll(query: RegistrationsQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    const where: Prisma.RegistrationWhereInput = {};

    if (query.courseId) {
      where.courseId = +query.courseId;
    }

    let orderBy: Prisma.RegistrationOrderByWithRelationInput = {};

    if (query.orderBy && query.orderType) {
      const [relation, field] = query.orderBy.split('.');

      if (field) {
        orderBy = { [relation]: { [field]: query.orderType } };
      } else {
        orderBy = { [query.orderBy]: query.orderType };
      }
    }

    let skip = 0;

    if (page && limit) {
      skip = (page - 1) * limit;
    }

    const [data, totalCount] = await this.prisma.$transaction([
      this.prisma.registration.findMany({
        where,
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
        include: { user: true, course: true },
      }),
      this.prisma.registration.count({ where }),
    ]);

    return { data, totalCount };
  }

  findByUserId(userId: string) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByCourseId(courseId: number) {
    return this.prisma.registration.findMany({
      where: { courseId },
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findCurrent(userId: string, courseId: number) {
    return this.prisma.registration.findUnique({
      where: { courseId_userId: { userId, courseId } },
    });
  }

  updateEnabled(id: number, dto: ChangeEnableCertificateDto) {
    return this.prisma.registration.update({
      where: { id },
      data: dto,
    });
  }

  updatePayment(id: number, dto: UpdateRegistrationPaymentDto) {
    return this.prisma.registration.update({
      where: { id },
      data: { paymentStatus: dto.status },
    });
  }

  async updatePaymentReceipt(
    id: number,
    req: Request,
    file?: Express.Multer.File,
  ) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      throw new UnauthorizedException(
        'Сесію користувача не знайдено. Увійдіть у систему повторно',
      );
    }

    const paymentReceiptsUrl = file
      ? `/upload/payment-receipts/${file.filename}`
      : '';

    const registration = await this.prisma.registration.findFirst({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Реєстрацію не знайдено');
    }

    const oldImage = registration.paymentReceipt;

    if (oldImage) {
      try {
        const oldPath = path.join(process.cwd(), oldImage);
        await fs.unlink(oldPath);
      } catch (e) {
        console.log('Old avatar not found, skip delete');
      }
    }

    return this.prisma.registration.update({
      where: { id },
      data: { paymentReceipt: paymentReceiptsUrl, paymentStatus: 'PENDING' },
    });
  }

  async remove(id: number) {
    await this.prisma.registration.delete({ where: { id } });
    return id;
  }
}
