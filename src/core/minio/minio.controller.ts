import {
  Post,
  Query,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  IMAGE_UPLOAD_OPTIONS,
  DOCUMENT_UPLOAD_OPTIONS,
  ANY_FILE_UPLOAD_OPTIONS,
} from 'src/shared/lib/file-upload.utils';
import { MinioService } from './minio.service';
import { generateFilename } from '../../shared/lib/generate-filename';

@Controller('files')
export class FilesController {
  constructor(private readonly minioService: MinioService) {}

  // ─── Завантаження зображень ──────────────────────────────────────────────────

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('image', IMAGE_UPLOAD_OPTIONS))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.handleUpload(file, folder || 'images');
  }

  // ─── Завантаження документів (PDF) ───────────────────────────────────────────

  @Post('upload/document')
  @UseInterceptors(FileInterceptor('document', DOCUMENT_UPLOAD_OPTIONS))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.handleUpload(file, folder || 'documents');
  }

  // ─── Універсальне завантаження (будь-який дозволений тип) ────────────────────

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', ANY_FILE_UPLOAD_OPTIONS))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string,
  ) {
    if (!folder) {
      throw new BadRequestException(
        'Параметр "folder" є обов\'язковим для загального завантаження',
      );
    }

    return this.handleUpload(file, folder);
  }

  // ─── Спільна логіка завантаження ─────────────────────────────────────────────

  private async handleUpload(file: Express.Multer.File, folderName: string) {
    const fileName = generateFilename(file.originalname);

    const filePath = await this.minioService.uploadFile(
      folderName,
      fileName,
      file.buffer,
      file.mimetype,
    );

    return { url: filePath };
  }
}
