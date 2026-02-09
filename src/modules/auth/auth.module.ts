import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.conteroller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
