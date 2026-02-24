import { Get, Param, Controller } from '@nestjs/common';

import { CertificateNumberService } from './certificate-number.service';

@Controller('certificate-numbers')
export class CertificateNumberController {
  constructor(
    private readonly certificateNumberService: CertificateNumberService,
  ) {}

  @Get('/:id')
  async getByRegistrationId(@Param('id') id: string) {
    return this.certificateNumberService.getByRegistrationId(+id);
  }
}
