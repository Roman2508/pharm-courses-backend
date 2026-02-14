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

import { Roles } from 'src/shared/decorators/roles.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { CertificateTemplateService } from './certificate-template.service';

@Controller('certificate-template')
export class CertificateTemplateController {
  constructor(
    private readonly certificateTemplateService: CertificateTemplateService,
  ) {}

  @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('templateFile'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.certificateTemplateService.create(body, req, file);
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.certificateTemplateService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateTemplateService.findOne(+id);
  }

  @Roles('admin')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('templateFile'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.certificateTemplateService.update(+id, body, file);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.certificateTemplateService.remove(+id, req);
  }
}
