import { Module } from '@nestjs/common';
import { MinioModule } from 'src/core/minio/minio.module';

import { CertificateTemplateService } from './certificate-template.service';
import { CertificateTemplateController } from './certificate-template.controller';

@Module({
  imports: [MinioModule],
  controllers: [CertificateTemplateController],
  providers: [CertificateTemplateService],
})
export class CertificateTemplateModule {}
