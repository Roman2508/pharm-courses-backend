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
import { ManyRegistrationsDto } from './dto/many-registrations.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ChangeEnableCertificateDto } from './dto/update-enabled.dto';
import { RegistrationsQueryDto } from './dto/registrations-query.dto';
import { ExportRegistrationsDto } from './dto/export-registration.dto';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';
import { UpdateRegistrationPaymentDto } from './dto/update-registration.dto';
import { generateSertificateNumber } from 'src/shared/helpers/generate-sertificate-number';
import { RegistrationsUserQueryDto } from './dto/registrations-user-query.dto';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly prisma: PrismaService,
  ) {}

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

  async findByUserId(userId: string, query: RegistrationsUserQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    let skip = 0;

    if (page && limit) {
      skip = (page - 1) * limit;
    }

    const [data, totalCount] = await this.prisma.$transaction([
      this.prisma.registration.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { course: { include: { certificateTemplate: true } } },
      }),
      this.prisma.registration.count({ where: { userId } }),
    ]);

    return { data, totalCount };
  }

  findMany(dto: ManyRegistrationsDto) {
    return this.prisma.registration.findMany({
      where: { id: { in: dto.ids } },
      include: { course: true, user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  findCountByCourseId(courseId: number) {
    return this.prisma.registration.count({ where: { courseId } });
  }

  findCurrent(userId: string, courseId: number) {
    return this.prisma.registration.findUnique({
      where: { courseId_userId: { userId, courseId } },
      include: { course: { select: { paymentQrCode: true } } },
    });
  }

  updateEnabled(dto: ChangeEnableCertificateDto) {
    return this.prisma.registration.updateMany({
      where: { id: { in: dto.ids } },
      data: { certificateEnabled: dto.certificateEnabled },
    });
  }

  async exportRegistration(dto: ExportRegistrationsDto) {
    const registrations = await this.prisma.registration.findMany({
      where: { id: { in: dto.ids } },
      include: { course: true, user: true },
    });

    if (!registrations.length) {
      throw new NotFoundException('Реєстрації не знайдені');
    }

    const results = await this.googleSheetsService.getResponses();

    const resultsMap = new Map(
      results.map((r) => [r.email.toLowerCase(), r.result]),
    );

    const newData = registrations.map((reg) => {
      const { course, user, type, id } = reg;

      const currentYear = new Date().getFullYear();

      const regNumber = generateSertificateNumber(id);
      const sertNumber = `${currentYear}-2044-${course.numberOfInclusionToBpr}-${regNumber}`;

      const email = reg.user.email.toLowerCase();
      const result = resultsMap.get(email);

      return {
        ['Реєстраційний номер Провайдера']: '2044',
        ['Реєстраційний номер заходу']: course.numberOfInclusionToBpr,
        ['Номер сертифіката']: sertNumber,
        ["Прізвище, власне ім'я, по батькові (за наявності) учасника"]:
          user.name,
        ['Бали БПР']:
          type === 'TRAINER' ? course.pointsBpr * 2 : course.pointsBpr,
        ['Дата народження']: user.birthDate
          ? new Date(user.birthDate).toLocaleDateString('uk-UA')
          : undefined,
        ['Засоби зв’язку (електронна адреса)']: user.email,
        ['Освіта']: user.education,
        ['Місце роботи']: user.workplace,
        ['Найменування займаної посади']: user.jobTitle,
        ['Результати оцінювання за проходження заходу БПР учасників заходу, які отримали сертифікати']:
          type === 'TRAINER' ? 'Тренер' : result || 'Не проходив',
      };
    });

    return newData.filter((el: any) => !!Object.keys(el).length);
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
        console.log('Old payment receipt not found, skip delete');
      }
    }

    return this.prisma.registration.update({
      where: { id },
      data: { paymentReceipt: paymentReceiptsUrl, paymentStatus: 'PENDING' },
    });
  }

  async freeParticipation(
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

    const freeParticipationUrl = file
      ? `/upload/free-participation/${file.filename}`
      : '';

    const registration = await this.prisma.registration.findFirst({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Реєстрацію не знайдено');
    }

    const oldImage = registration.freeParticipation;

    if (oldImage) {
      try {
        const oldPath = path.join(process.cwd(), oldImage);
        await fs.unlink(oldPath);
      } catch (e) {
        console.log('Old free participation not found, skip delete');
      }
    }

    return this.prisma.registration.update({
      where: { id },
      data: {
        freeParticipation: freeParticipationUrl,
        paymentStatus: 'PENDING',
      },
    });
  }

  async remove(id: number, req: Request) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      throw new UnauthorizedException(
        'Сесію користувача не знайдено. Увійдіть у систему повторно',
      );
    }

    const existedReg = await this.prisma.registration.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existedReg) {
      throw new NotFoundException('Реєстрацію не знайдено');
    }

    if (existedReg.paymentReceipt) {
      try {
        const oldPath = path.join(process.cwd(), existedReg.paymentReceipt);
        await fs.unlink(oldPath).catch(() => {});
      } catch (e) {
        console.log('Old payment receipt not found, skip delete');
      }
    }

    await this.prisma.registration.delete({ where: { id } });
    return id;
  }

  async removeMany(dto: ManyRegistrationsDto) {
    const { ids } = dto;

    if (!ids || ids.length === 0) {
      throw new BadRequestException('Не передано id для видалення');
    }

    const registrations = await this.prisma.registration.findMany({
      where: { id: { in: ids } },
    });

    if (!registrations.length) {
      throw new NotFoundException('Реєстрації не знайдені');
    }

    await Promise.all(
      registrations.map((reg) => {
        if (!reg.paymentReceipt) return;

        const filePath = path.join(process.cwd(), reg.paymentReceipt);
        return fs.unlink(filePath).catch(() => {});
      }),
    );

    await this.prisma.registration.deleteMany({
      where: { id: { in: registrations.map((r) => r.id) } },
    });

    return registrations.map((r) => r.id);
  }
}
