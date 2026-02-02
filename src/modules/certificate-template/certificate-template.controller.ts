import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CertificateTemplateService } from './certificate-template.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';
import { auth } from 'src/shared/lib/auth';

@Controller('certificate-template')
export class CertificateTemplateController {
  constructor(
    private readonly certificateTemplateService: CertificateTemplateService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('templateFile'))
  async create(
    @Body() body: any,
    // @ts-ignore
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    // Verify admin role
    const session = await auth.api.getSession({ headers: req.headers });

    // if (!session?.user || session.user.role !== 'admin') {
    //   throw new UnauthorizedException(
    //     'Only admins can create certificate templates',
    //   );
    // }

    // Parse JSON fields from FormData
    const dto: CreateCertificateTemplateDto = {
      name: body.name,
      templateUrl: body.templateUrl || '',
      namePosition: JSON.parse(body.namePosition),
      courseNamePosition: JSON.parse(body.courseNamePosition),
      courseDatePosition: JSON.parse(body.courseDatePosition),
      certificateNumberPosition: JSON.parse(body.certificateNumberPosition),
      durationPosition: JSON.parse(body.durationPosition),
      pointsPosition: JSON.parse(body.pointsPosition),
      yearOfInclusionPosition: JSON.parse(body.yearOfInclusionPosition),
      numberOfInclusionPosition: JSON.parse(body.numberOfInclusionPosition),
      eventTypePosition: JSON.parse(body.eventTypePosition),
      certificateTypePosition: JSON.parse(body.certificateTypePosition),
    };

    if (!file && !dto.templateUrl) {
      throw new BadRequestException('PDF file or template URL is required');
    }

    return this.certificateTemplateService.create(dto, file);
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
    // @ts-ignore
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    // Verify admin role
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Only admins can update certificate templates',
      );
    }

    // Parse JSON fields from FormData
    const dto: UpdateCertificateTemplateDto = {
      name: body.name,
      templateUrl: body.templateUrl,
      namePosition: body.namePosition
        ? JSON.parse(body.namePosition)
        : undefined,
      courseNamePosition: body.courseNamePosition
        ? JSON.parse(body.courseNamePosition)
        : undefined,
      courseDatePosition: body.courseDatePosition
        ? JSON.parse(body.courseDatePosition)
        : undefined,
      certificateNumberPosition: body.certificateNumberPosition
        ? JSON.parse(body.certificateNumberPosition)
        : undefined,
      durationPosition: body.durationPosition
        ? JSON.parse(body.durationPosition)
        : undefined,
      pointsPosition: body.pointsPosition
        ? JSON.parse(body.pointsPosition)
        : undefined,
      yearOfInclusionPosition: body.yearOfInclusionPosition
        ? JSON.parse(body.yearOfInclusionPosition)
        : undefined,
      numberOfInclusionPosition: body.numberOfInclusionPosition
        ? JSON.parse(body.numberOfInclusionPosition)
        : undefined,
      eventTypePosition: body.eventTypePosition
        ? JSON.parse(body.eventTypePosition)
        : undefined,
      certificateTypePosition: body.certificateTypePosition
        ? JSON.parse(body.certificateTypePosition)
        : undefined,
    };

    return this.certificateTemplateService.update(+id, dto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    // Verify admin role
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user || session.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Only admins can delete certificate templates',
      );
    }

    return this.certificateTemplateService.remove(+id);
  }
}
