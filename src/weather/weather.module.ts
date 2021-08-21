import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherRetrieverService } from './weather-retriever-service/weather-retriever.service';
import { WeatherController } from './weather.controller';
import { Weather } from './weather.entity';
import { WeatherService } from './weather-service/weather.service';

@Module({
  imports: [TypeOrmModule.forFeature([Weather]), HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherRetrieverService],
})
export class WeatherModule {}
