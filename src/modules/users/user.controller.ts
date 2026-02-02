import {
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // findAll(@Query() query: UserQueryDto) {
  //   return this.userService.findAll(query);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  //   return this.userService.update(id, dto);
  // }
}
