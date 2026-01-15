import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreService } from './core.service';
import { CoreController } from './core.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
