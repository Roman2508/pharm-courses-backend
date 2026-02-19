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

import { User } from 'prisma/generated/client';
import { RegistrationService } from './registration.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { multerOptions } from 'src/shared/lib/multer-options';
import { ManyRegistrationsDto } from './dto/many-registrations.dto';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ChangeEnableCertificateDto } from './dto/update-enabled.dto';
import { RegistrationsQueryDto } from './dto/registrations-query.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
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

  @Roles('admin')
  @Get()
  findAll(@Query() query: RegistrationsQueryDto) {
    return this.registrationService.findAll(query);
  }

  @Get('/user')
  findByUserId(@CurrentUser() user: User) {
    return this.registrationService.findByUserId(user.id);
  }

  @Post('/many')
  findMany(@Body() dto: ManyRegistrationsDto) {
    return this.registrationService.findMany(dto);
  }

  @Get('/course/count/:courseId')
  findCountByCourseId(@Param('courseId') courseId: string) {
    return this.registrationService.findCountByCourseId(+courseId);
  }

  @Get('/course/current/:courseId')
  findCurrent(@CurrentUser() user: User, @Param('courseId') courseId: string) {
    return this.registrationService.findCurrent(user.id, +courseId);
  }

  @Roles('admin')
  @Patch('')
  updateEnabled(@Body() dto: ChangeEnableCertificateDto) {
    return this.registrationService.updateEnabled(dto);
  }

  @Roles('admin')
  @Post('remove/many')
  removeMany(@Body() dto: ManyRegistrationsDto) {
    return this.registrationService.removeMany(dto);
  }

  @Roles('admin')
  @Patch('/payment/:id')
  updatePayment(
    @Param('id') id: string,
    @Body() dto: UpdateRegistrationPaymentDto,
  ) {
    return this.registrationService.updatePayment(+id, dto);
  }

  @Patch('/payment-receipt/:id')
  @UseInterceptors(
    FileInterceptor(
      'paymentReceipt',
      multerOptions('./upload/payment-receipts'),
    ),
  )
  async updatePaymentReceipt(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.registrationService.updatePaymentReceipt(+id, req, file);
  }

  @Patch('/free-participation/:id')
  @UseInterceptors(
    FileInterceptor(
      'freeParticipation',
      multerOptions('./upload/free-participation'),
    ),
  )
  async freeParticipation(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.registrationService.freeParticipation(+id, req, file);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.registrationService.remove(+id, req);
  }
}
