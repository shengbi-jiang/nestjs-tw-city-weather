import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './app-config/app-config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  await app.listen(configService.port);
}
bootstrap();
