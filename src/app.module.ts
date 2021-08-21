import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { TypeormConfigModule } from './typeorm-config/typeorm-config.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [AppConfigModule, TypeormConfigModule, WeatherModule],
})
export class AppModule {}
