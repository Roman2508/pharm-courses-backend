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
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Roles('admin')
  @Post()
  @ApiBody({ type: CreateCourseDto })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  // @Get('generate-code')
  // async generateQrCode(@Query('amount') amount: string) {
  //   return this.courseService.generateQrCode(amount);
  // }

  @Roles('admin')
  @Get()
  findAll(@Query() query: CourseQueryDto) {
    return this.courseService.findAll(query);
  }

  @Public()
  @Get('/status/:status')
  findByStatus(
    @Param('status') status: string,
    @Query() query: CourseQueryDto,
  ) {
    return this.courseService.findByStatus(status, query);
  }

  @Public()
  @Get('/:admin/:id')
  findOne(@Param('id') id: string, @Param('admin') admin: string) {
    return this.courseService.findOne(+id, admin === 'admin');
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
