import {
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CertificateNumberService } from './certificate-number.service';

@Controller('certificate-numbers')
export class CertificateNumberController {
  constructor(
    private readonly certificateNumberService: CertificateNumberService,
  ) {}

//   @Roles('admin')
//   @HttpCode(HttpStatus.OK)
//   async issue(@Param('registrationId', ParseIntPipe) registrationId: number) {
//     return this.certificateNumberService.issueStandalone(registrationId);
//   }

//   @Roles('admin')
//   @HttpCode(HttpStatus.OK)
//   async release(@Param('registrationId', ParseIntPipe) registrationId: number) {
//     return this.certificateNumberService.releaseStandalone(registrationId);
//   }
}
