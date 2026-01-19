import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';

@Injectable()
export class CertificateTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCertificateTemplateDto) {
    return this.prisma.certificateTemplate.create({ data: dto });
  }

  findAll() {
    return this.prisma.certificateTemplate.findMany();
  }

  findOne(id: number) {
    return this.prisma.certificateTemplate.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateCertificateTemplateDto) {
    return this.prisma.certificateTemplate.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.prisma.certificateTemplate.delete({ where: { id } });
    return id;
  }
}
