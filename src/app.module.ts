import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { TypeormConfigModule } from './typeorm-config/typeorm-config.module';

@Module({
  imports: [AppConfigModule, TypeormConfigModule],
})
export class AppModule {}
