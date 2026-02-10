import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/users/user.module';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CourseModule } from 'src/modules/course/course.module';
import { BetterAuthGuard } from 'src/shared/guards/better-auth.guard';
import { RegistrationModule } from 'src/modules/registration/registration.module';
import { CertificateTemplateModule } from 'src/modules/certificate-template/certificate-template.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    CourseModule,
    RegistrationModule,
    CertificateTemplateModule,
  ],
  controllers: [CoreController],
  providers: [
    CoreService,
    {
      provide: APP_GUARD,
      useClass: BetterAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class CoreModule {}
