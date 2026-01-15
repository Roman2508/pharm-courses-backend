import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

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
