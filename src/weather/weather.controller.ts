import { Controller, Get, Param } from '@nestjs/common';
import { CityPipe } from './request.pipe';
import { WeatherService } from './weather-service/weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':city')
  async getWeather(@Param('city', CityPipe) city: string) {
    const { data } = await this.weatherService.mustReadOneByCity(city);
    return data;
  }
}
