import path from 'path';
import * as fs from 'node:fs/promises';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { auth } from 'src/shared/lib/auth';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAvatar(req: Request, file?: Express.Multer.File) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      throw new UnauthorizedException(
        'Сесію користувача не знайдено. Увійдіть у систему повторно',
      );
    }

    const avatarUrl = file ? `/upload/avatars/${file.filename}` : '';
    const oldImage = session.user.image;

    if (oldImage) {
      try {
        const oldPath = path.join(process.cwd(), oldImage);
        await fs.unlink(oldPath);
      } catch (e) {
        console.log('Old avatar not found, skip delete');
      }
    }

    return auth.api.updateUser({
      headers: req.headers,
      body: { image: avatarUrl },
    });
  }
}
