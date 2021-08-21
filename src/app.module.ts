import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule } from './app-config/app-config.module';
import { AuthModule } from './auth/auth.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { TypeormConfigModule } from './typeorm-config/typeorm-config.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    AppConfigModule,
    TypeormConfigModule,
    InfrastructureModule,
    AuthModule,
    WeatherModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
