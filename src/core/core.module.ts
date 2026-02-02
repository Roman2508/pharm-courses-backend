import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/users/user.module';
import { CourseModule } from 'src/modules/course/course.module';
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
  providers: [CoreService],
})
export class CoreModule {}
