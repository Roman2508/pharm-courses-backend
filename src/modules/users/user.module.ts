import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './upload/avatars',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          const filename = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}.${ext}`;
          cb(null, filename);
        },
      }),

      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Можна завантажити лише файли з розширенням: jpeg, jpg, png та webp',
            ),
            false,
          );
        }
      },

      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB для аватарів
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
