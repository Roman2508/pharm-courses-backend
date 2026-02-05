import { BadRequestException, Injectable } from '@nestjs/common';

import { CourseQueryDto } from './dto/course-query.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  async findAll(query: CourseQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    // return this.prisma.course.findMany({
    //   take: limit,
    //   skip: (page - 1) * limit,
    //   orderBy: { createdAt: 'desc' },
    // });

    const [data, totalCount] = await this.prisma.$transaction([
      this.prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.course.count(),
    ]);

    return { data, totalCount };
  }

  findByStatus(status: string, query: CourseQueryDto) {
    if (status !== 'PLANNED' && status !== 'ARCHIVED') {
      throw new BadRequestException('Сourse status is invalid');
    }

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 9999);

    return this.prisma.course.findMany({
      where: { status },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { certificateTemplate: true },
    });
  }

  update(id: number, dto: UpdateCourseDto) {
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.prisma.course.delete({ where: { id } });
    return id;
  }
}
