import { Module } from '@nestjs/common';

import { AuthController } from './auth.conteroller';

@Module({
  controllers: [AuthController],
})
export class AuthModule {}
