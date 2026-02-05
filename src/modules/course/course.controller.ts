import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { CourseService } from './course.service';
import { CourseQueryDto } from './dto/course-query.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiBody({ type: CreateCourseDto })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  findAll(@Query() query: CourseQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get('/status/:status')
  findByStatus(
    @Param('status') status: string,
    @Query() query: CourseQueryDto,
  ) {
    return this.courseService.findByStatus(status, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
