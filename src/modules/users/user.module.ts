import { Module } from '@nestjs/common';
import { MinioModule } from 'src/core/minio/minio.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [MinioModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
