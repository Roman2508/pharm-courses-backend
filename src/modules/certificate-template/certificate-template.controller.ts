import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificateTemplateService } from './certificate-template.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';

@Controller('certificate-template')
export class CertificateTemplateController {
  constructor(private readonly certificateTemplateService: CertificateTemplateService) {}

  @Post()
  create(@Body() createCertificateTemplateDto: CreateCertificateTemplateDto) {
    return this.certificateTemplateService.create(createCertificateTemplateDto);
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
  update(@Param('id') id: string, @Body() updateCertificateTemplateDto: UpdateCertificateTemplateDto) {
    return this.certificateTemplateService.update(+id, updateCertificateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificateTemplateService.remove(+id);
  }
}
