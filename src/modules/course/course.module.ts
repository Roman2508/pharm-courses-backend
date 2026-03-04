import { Module } from '@nestjs/common';
import { MinioModule } from 'src/core/minio/minio.module';

import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [MinioModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
