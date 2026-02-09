import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(CoreModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.set('trust proxy', 1);

  app.useStaticAssets(join(process.cwd(), 'upload'), { prefix: '/upload/' });

  // app.enableCors({ origin: 'http://localhost:5173', credentials: true });
  // app.enableCors({ origin: true, credentials: true });
  const allowedOrigins = (process.env.TRUSTED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Pharm couses API')
      .setDescription('This is the pharm courses API documentation')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);
  }

  const PORT = process.env.PORT || 7777;

  try {
    await app.listen(PORT);
    console.log(`🚀 Server is running at port: ${PORT}`);
  } catch (error: any) {
    console.error(`❌ Failed to start server: ${error.message}`, error);
    process.exit(1);
  }
}
bootstrap();
