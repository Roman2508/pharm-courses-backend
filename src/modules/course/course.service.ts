import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCourseDto) {
    console.log(dto);
    // @ts-ignore
    return this.prisma.course.create({ data: dto });
  }

  findAll() {
    return this.prisma.course.findMany();
  }

  findByStatus(status: string) {
    if (status !== 'PLANNED' && status !== 'ARCHIVED') {
      throw new BadRequestException('Сourse status is invalid');
    }
    return this.prisma.course.findMany({ where: { status } });
  }

  findOne(id: number) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateCourseDto) {
    // @ts-ignore
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.course.delete({ where: { id } });
  }
}
