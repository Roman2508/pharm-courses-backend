import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { CertificateNumberService } from './certificate-number.service';

@Module({
  imports: [PrismaModule],
  providers: [CertificateNumberService],
  exports: [CertificateNumberService],
})
export class CertificateNumberModule {}
