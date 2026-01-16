import { Module } from '@nestjs/common';
import { CertificateTemplateService } from './certificate-template.service';
import { CertificateTemplateController } from './certificate-template.controller';

@Module({
  controllers: [CertificateTemplateController],
  providers: [CertificateTemplateService],
})
export class CertificateTemplateModule {}
