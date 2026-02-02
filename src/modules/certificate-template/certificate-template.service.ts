import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';

@Injectable()
export class CertificateTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  // @ts-ignore
  create(dto: CreateCertificateTemplateDto, file?: Express.Multer.File) {
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

  update(
    id: number,
    dto: UpdateCertificateTemplateDto,
    // @ts-ignore
    file?: Express.Multer.File,
  ) {
    const templateUrl = file
      ? `/upload/templates/${file.filename}`
      : dto.templateUrl;

    const dataToUpdate: any = { ...dto };

    if (file) {
      dataToUpdate.templateUrl = templateUrl;
    }

    return this.prisma.certificateTemplate.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    await this.prisma.certificateTemplate.delete({ where: { id } });
    return id;
  }
}
