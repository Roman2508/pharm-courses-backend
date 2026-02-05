import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import path from 'path';
import * as fs from 'node:fs/promises';

import { auth } from 'src/shared/lib/auth';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';

@Injectable()
export class CertificateTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any, req: Request, file?: Express.Multer.File) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user || session.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Тільки адміністратор може створити шаблон сертифіката',
      );
    }

    const dto: CreateCertificateTemplateDto = {
      name: body.name,
      templateUrl: body.templateUrl || '',
      namePosition: JSON.parse(body.namePosition),
      courseNamePosition: JSON.parse(body.courseNamePosition),
      courseDatePosition: JSON.parse(body.courseDatePosition),
      certificateNumberPosition: JSON.parse(body.certificateNumberPosition),
      durationPosition: JSON.parse(body.durationPosition),
      pointsPosition: JSON.parse(body.pointsPosition),
      yearOfInclusionPosition: JSON.parse(body.yearOfInclusionPosition),
      numberOfInclusionPosition: JSON.parse(body.numberOfInclusionPosition),
      eventTypePosition: JSON.parse(body.eventTypePosition),
      certificateTypePosition: JSON.parse(body.certificateTypePosition),
    };

    if (!file && !dto.templateUrl) {
      throw new BadRequestException(
        "PDF файл або URL шаблону сертифіката є обов'язковим",
      );
    }

    const templateUrl = file
      ? `/upload/templates/${file.filename}`
      : dto.templateUrl;

    return this.prisma.certificateTemplate.create({
      data: {
        ...dto,
        templateUrl,
      },
    });
  }

  findAll() {
    return this.prisma.certificateTemplate.findMany();
  }

  findOne(id: number) {
    return this.prisma.certificateTemplate.findUnique({ where: { id } });
  }

  async update(
    id: number,
    body: any,
    req: Request,
    file?: Express.Multer.File,
  ) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Тільки адміністратор може оновити шаблон сертифіката',
      );
    }

    const dto: UpdateCertificateTemplateDto = {
      name: body.name,
      templateUrl: body.templateUrl,
      namePosition: body.namePosition
        ? JSON.parse(body.namePosition)
        : undefined,
      courseNamePosition: body.courseNamePosition
        ? JSON.parse(body.courseNamePosition)
        : undefined,
      courseDatePosition: body.courseDatePosition
        ? JSON.parse(body.courseDatePosition)
        : undefined,
      certificateNumberPosition: body.certificateNumberPosition
        ? JSON.parse(body.certificateNumberPosition)
        : undefined,
      durationPosition: body.durationPosition
        ? JSON.parse(body.durationPosition)
        : undefined,
      pointsPosition: body.pointsPosition
        ? JSON.parse(body.pointsPosition)
        : undefined,
      yearOfInclusionPosition: body.yearOfInclusionPosition
        ? JSON.parse(body.yearOfInclusionPosition)
        : undefined,
      numberOfInclusionPosition: body.numberOfInclusionPosition
        ? JSON.parse(body.numberOfInclusionPosition)
        : undefined,
      eventTypePosition: body.eventTypePosition
        ? JSON.parse(body.eventTypePosition)
        : undefined,
      certificateTypePosition: body.certificateTypePosition
        ? JSON.parse(body.certificateTypePosition)
        : undefined,
    };

    const templateUrl = file
      ? `/upload/templates/${file.filename}`
      : dto.templateUrl;

    const registration = await this.prisma.certificateTemplate.findFirst({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Шаблон сертифіката не знайдено');
    }

    const oldTemplateUrl = registration.templateUrl;

    if (oldTemplateUrl) {
      try {
        const oldPath = path.join(process.cwd(), oldTemplateUrl);
        await fs.unlink(oldPath);
      } catch (e) {
        console.log('Old template not found, skip delete');
      }
    }

    const dataToUpdate: any = { ...dto };

    if (file) {
      dataToUpdate.templateUrl = templateUrl;
    }

    return this.prisma.certificateTemplate.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number, req: Request) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Тільки адміністратор може видалити шаблон сертифіката',
      );
    }
    await this.prisma.certificateTemplate.delete({ where: { id } });
    return id;
  }
}
