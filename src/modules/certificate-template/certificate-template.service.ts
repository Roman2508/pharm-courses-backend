import { Injectable } from '@nestjs/common';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';

@Injectable()
export class CertificateTemplateService {
  create(createCertificateTemplateDto: CreateCertificateTemplateDto) {
    return 'This action adds a new certificateTemplate';
  }

  findAll() {
    return `This action returns all certificateTemplate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificateTemplate`;
  }

  update(id: number, updateCertificateTemplateDto: UpdateCertificateTemplateDto) {
    return `This action updates a #${id} certificateTemplate`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificateTemplate`;
  }
}
