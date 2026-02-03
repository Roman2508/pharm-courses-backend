import { FileInterceptor } from '@nestjs/platform-express';
import {
  Req,
  Patch,
  Controller,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(req, file);
  }
}
