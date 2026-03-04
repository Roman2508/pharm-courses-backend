import { Client } from 'minio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioService {
  private minioClient: Client;

  constructor() {
    const port = process.env.MINIO_PORT
      ? Number(process.env.MINIO_PORT)
      : undefined;

    this.minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      // port: port,
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }

  async uploadFile(
    folder: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    const bucketName = 'bpr';
    const objectName = `${folder}/${fileName}`;

    // Перевіряємо чи існує бакет, якщо ні — створюємо
    const bucketExists = await this.minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(bucketName, 'us-east-1');
    }

    // Завантажуємо файл
    await this.minioClient.putObject(
      bucketName,
      objectName,
      buffer,
      buffer.length,
      { 'Content-Type': mimeType },
    );

    return `${bucketName}/${objectName}`;
  }

  async deleteFile(path: string) {
    if (!path) return;

    // Remove leading /upload/ if present (for backward compatibility or old format)
    const cleanPath = path.startsWith('/upload/')
      ? path.replace('/upload/', '')
      : path;
    const parts = cleanPath.split('/');

    if (parts.length < 2) return;

    const bucketName = parts[0];
    const fileName = parts.slice(1).join('/');

    try {
      await this.minioClient.removeObject(bucketName, fileName);
    } catch (e) {
      console.error(`Помилка видалення файлу з MinIO: ${path}`, e);
    }
  }
}
