import { Module } from '@nestjs/common';

import { CourseService } from './course.service';
import { CourseController } from './course.controller';
// import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  // imports: [PrismaModule],
  exports: [CourseService],
})
export class CourseModule {}
