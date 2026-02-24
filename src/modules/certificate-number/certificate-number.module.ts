import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/core/prisma/prisma.module';
import { CertificateNumberService } from './certificate-number.service';
import { CertificateNumberController } from './certificate-number.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CertificateNumberController],
  providers: [CertificateNumberService],
  exports: [CertificateNumberService],
})
export class CertificateNumberModule {}
