import { Injectable, UnauthorizedException } from '@nestjs/common';

import { auth } from 'src/shared/lib/auth';
import { MinioService } from 'src/core/minio/minio.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { generateFilename } from '../../shared/lib/generate-filename';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async updateAvatar(req: Request, file?: Express.Multer.File) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      throw new UnauthorizedException(
        'Сесію користувача не знайдено. Увійдіть у систему повторно',
      );
    }

    const oldImage = session.user.image;

    if (oldImage) {
      await this.minioService.deleteFile(oldImage);
    }

    let avatarUrl = '';
    if (file) {
      const fileName = generateFilename(file.originalname);
      avatarUrl = await this.minioService.uploadFile(
        'avatars',
        fileName,
        file.buffer,
        file.mimetype,
      );
    }

    return auth.api.updateUser({
      headers: req.headers,
      body: { image: avatarUrl },
    });
  }
}
