import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CertificateTemplateService } from './certificate-template.service';
import { CertificateTemplateController } from './certificate-template.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './upload/templates',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          const filename = `${file.originalname.replace(
            /\.pdf$/i,
            '',
          )}-${uniqueSuffix}.pdf`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [CertificateTemplateController],
  providers: [CertificateTemplateService],
})
export class CertificateTemplateModule {}
