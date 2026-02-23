import { Module } from '@nestjs/common';

import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';
import { CertificateNumberModule } from '../certificate-number/certificate-number.module';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService],
  imports: [GoogleSheetsModule, CertificateNumberModule],
})
export class RegistrationModule {}
