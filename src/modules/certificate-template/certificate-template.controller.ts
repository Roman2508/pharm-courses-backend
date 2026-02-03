import {
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CertificateTemplateService } from './certificate-template.service';

@Controller('certificate-template')
export class CertificateTemplateController {
  constructor(
    private readonly certificateTemplateService: CertificateTemplateService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('templateFile'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.certificateTemplateService.create(body, req, file);
  }

  @Get()
  findAll() {
    return this.certificateTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateTemplateService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('templateFile'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.certificateTemplateService.update(+id, body, req, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.certificateTemplateService.remove(+id, req);
  }
}
