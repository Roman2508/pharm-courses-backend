import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService],
  imports: [GoogleSheetsModule],
})
export class RegistrationModule {}
