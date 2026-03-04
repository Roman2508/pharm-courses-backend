import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// ─── Пресети дозволених MIME-типів ─────────────────────────────────────────────

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];

export const ALLOWED_DOCUMENT_MIMES = ['application/pdf'];

export const ALLOWED_ALL_MIMES = [
  ...ALLOWED_IMAGE_MIMES,
  ...ALLOWED_DOCUMENT_MIMES,
];

// ─── Фабрика для створення multer-опцій з валідацією ───────────────────────────

export function createMulterOptions(
  allowedMimeTypes: string[],
  maxSizeMb = 5,
): MulterOptions {
  return {
    fileFilter: (_req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            `Неприпустимий тип файлу: ${
              file.mimetype
            }. Дозволені: ${allowedMimeTypes.join(', ')}`,
          ),
          false,
        );
      }
    },
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
  };
}

// ─── Готові конфігурації ────────────────────────────────────────────────────────

export const IMAGE_UPLOAD_OPTIONS = createMulterOptions(ALLOWED_IMAGE_MIMES, 5);
export const DOCUMENT_UPLOAD_OPTIONS = createMulterOptions(
  ALLOWED_DOCUMENT_MIMES,
  10,
);
export const ANY_FILE_UPLOAD_OPTIONS = createMulterOptions(
  ALLOWED_ALL_MIMES,
  10,
);
