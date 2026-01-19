import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ChangeEnableCertificateDto } from './dto/update-enabled.dto';
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
      throw new BadRequestException('Ви вже зареєстровані на цей курс');
    }

    return this.prisma.registration.create({ data: dto });
  }

  findAll() {
    return this.prisma.registration.findMany();
  }

  findByUserId(userId: string) {
    return this.prisma.registration.findMany({ where: { userId } });
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
      data: dto,
    });
  }

  async remove(id: number) {
    await this.prisma.registration.delete({ where: { id } });
    return id;
  }
}
