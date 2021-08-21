import { Controller, Get, Param } from '@nestjs/common';
import { CityPipe } from './request.pipe';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  getWeather(@Param('city', CityPipe) city: string) {
    // TODO: return the weather data of the specified city.
  }
}
