import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局配置
  app.setGlobalPrefix('api');
  app.enableCors();

  // 启动服务
  const port = process.env.PORT ?? 25936;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
