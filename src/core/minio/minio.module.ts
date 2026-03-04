import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { FilesController } from './minio.controller';

@Module({
  controllers: [FilesController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
