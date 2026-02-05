import {
  Req,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ChangeEnableCertificateDto } from './dto/update-enabled.dto';
import { RegistrationsQueryDto } from './dto/registrations-query.dto';
import { UpdateRegistrationPaymentDto } from './dto/update-registration.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationService.create(dto);
  }

  @Post('/free')
  createForFree(@Body() dto: CreateRegistrationDto) {
    return this.registrationService.createForFree(dto);
  }

  @Get()
  findAll(@Query() query: RegistrationsQueryDto) {
    return this.registrationService.findAll(query);
  }

  @Get('/user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.registrationService.findByUserId(userId);
  }

  @Get('/current/:userId/:courseId')
  findCurrent(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.registrationService.findCurrent(userId, +courseId);
  }

  @Patch(':id')
  updateEnabled(
    @Param('id') id: string,
    @Body() dto: ChangeEnableCertificateDto,
  ) {
    return this.registrationService.updateEnabled(+id, dto);
  }

  @Patch('/payment/:id')
  updatePayment(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationPaymentDto,
  ) {
    return this.registrationService.updatePayment(+id, dto);
  }

  @Patch('/payment-receipt/:id')
  @UseInterceptors(FileInterceptor('paymentReceipt'))
  async updatePaymentReceipt(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.registrationService.updatePaymentReceipt(+id, req, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrationService.remove(+id);
  }
}
