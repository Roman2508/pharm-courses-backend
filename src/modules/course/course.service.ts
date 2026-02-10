import path from 'path';
import { join } from 'path';
import * as fs from 'node:fs/promises';
import { writeFile } from 'fs/promises';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CourseQueryDto } from './dto/course-query.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    const paymentQrCode = await this.generateQrCode(dto.price);
    return this.prisma.course.create({ data: { ...dto, paymentQrCode } });
  }

  async findAll(query: CourseQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    const [data, totalCount] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.course.count(),
    ]);

    return { data, totalCount };
  }

  findByStatus(status: string, query: CourseQueryDto) {
    if (status !== 'PLANNED' && status !== 'ARCHIVED') {
      throw new BadRequestException('Сourse status is invalid');
    }

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 9999);

    return this.prisma.course.findMany({
      where: { status },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { certificateTemplate: true },
    });
  }

  async update(id: number, dto: UpdateCourseDto) {
    const oldCourse = await this.prisma.course.findUnique({ where: { id } });

    let paymentQrCode = oldCourse?.paymentQrCode;

    if (paymentQrCode) {
      try {
        const oldPath = path.join(process.cwd(), paymentQrCode);
        await fs.unlink(oldPath);
      } catch (e) {
        console.log('Old QR code not found, skip delete');
      }
    }

    if (dto.price && oldCourse && oldCourse.price !== dto.price) {
      paymentQrCode = await this.generateQrCode(dto.price);
    }

    return this.prisma.course.update({
      where: { id },
      data: { ...dto, paymentQrCode },
    });
  }

  async remove(id: number) {
    await this.prisma.course.delete({ where: { id } });
    return id;
  }

  async generateQrCode(amount: number) {
    try {
      const data = await fetch(process.env.BANK_QR_CODE_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': process.env.BANK_QR_CODE_API_KEY!,
        },
        body: JSON.stringify({
          name: 'Державна казначейська служба України, м. Київ',
          account: 'UA528201720314271004202020020',
          code: '02011261',
          amount: amount,
          description: 'Плата за БПР, ПІБ учасника',
        }),
      });
      const qrCodeData = await data.json();

      if (!qrCodeData?.resultData?.qr) {
        throw new Error('Не знайдено QR code у відповіді від сервісу');
      }

      const qrCodeUrl = qrCodeData.resultData.qr;
      const response = await fetch(qrCodeUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch QR code: ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      const filename = `qr-code-${Date.now()}.png`;
      const uploadDir = join(process.cwd(), 'upload', 'qr-codes');
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);

      return filePath;
    } catch (error) {
      throw new Error('Помилка при отриманні QR-коду');
    }
  }
}
