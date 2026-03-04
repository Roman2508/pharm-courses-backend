import {
  Req,
  Patch,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { IMAGE_UPLOAD_OPTIONS } from 'src/shared/lib/file-upload.utils';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('avatar', IMAGE_UPLOAD_OPTIONS))
  async updateAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(req, file);
  }
}
