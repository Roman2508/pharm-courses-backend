import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ChangeEnableCertificateDto } from './dto/update-enabled.dto';
import { UpdateRegistrationPaymentDto } from './dto/update-registration.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationService.create(dto);
  }

  @Get()
  findAll() {
    return this.registrationService.findAll();
  }

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.registrationService.findByUserId(userId);
  }

  @Patch(':id')
  updateEnabled(@Param('id') id: string, @Body() dto: ChangeEnableCertificateDto) {
    return this.registrationService.updateEnabled(+id, dto);
  }

  @Patch('/payment/:id')
  updatePayment(@Param('id') id: string, @Body() dto: UpdateRegistrationPaymentDto) {
    return this.registrationService.updatePayment(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrationService.remove(+id);
  }
}
