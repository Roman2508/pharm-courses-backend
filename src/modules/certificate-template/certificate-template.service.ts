import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from 'src/shared/lib/auth';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MinioService } from 'src/core/minio/minio.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';
import { generateFilename } from 'src/shared/lib/generate-filename';

@Injectable()
export class CertificateTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async create(body: any, _: Request, file?: Express.Multer.File) {
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

    let templateUrl = dto.templateUrl || '';
    if (file) {
      const fileName = generateFilename(file.originalname);
      templateUrl = await this.minioService.uploadFile(
        'templates',
        fileName,
        file.buffer,
        file.mimetype,
      );
    }

    return this.prisma.certificateTemplate.create({
      data: { ...dto, templateUrl },
    });
  }

  findAll() {
    return this.prisma.certificateTemplate.findMany();
  }

  findOne(id: number) {
    return this.prisma.certificateTemplate.findUnique({ where: { id } });
  }

  async update(id: number, body: any, file?: Express.Multer.File) {
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

    const registration = await this.prisma.certificateTemplate.findFirst({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException('Шаблон сертифіката не знайдено');
    }

    const oldTemplateUrl = registration.templateUrl;

    let templateUrl = dto.templateUrl;
    if (file) {
      if (oldTemplateUrl) {
        await this.minioService.deleteFile(oldTemplateUrl);
      }
      const fileName = generateFilename(file.originalname);
      templateUrl = await this.minioService.uploadFile(
        'templates',
        fileName,
        file.buffer,
        file.mimetype,
      );
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
    const template = await this.prisma.certificateTemplate.findUnique({
      where: { id },
    });

    if (template?.templateUrl) {
      await this.minioService.deleteFile(template.templateUrl);
    }

    await this.prisma.certificateTemplate.delete({ where: { id } });
    return id;
  }
}
