import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidV4 } from 'uuid';
import { Repository } from 'typeorm';
import {
  WeatherResponseResult,
  Location as WeatherAtLocation,
} from '../weather-retriever-service/weather-response-result.type';
import { Weather } from '../weather.entity';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {}

  async readOneByCity(city: string): Promise<Weather | null> {
    const weather = await this.weatherRepository.findOne({ city });
    return weather ?? null;
  }

  async mustReadOneByCity(city: string): Promise<Weather> {
    const weather = await this.readOneByCity(city);
    if (!weather) {
      throw new NotFoundException();
    }
    return weather;
  }

  async createOne(location: WeatherAtLocation): Promise<Weather> {
    const weather = this.weatherRepository.create({
      id: uuidV4(),
      city: location.locationName,
      data: location as Record<string, any>,
    });
    return await this.weatherRepository.save(weather);
  }

  private async updateCurrentWeatherByLocation(location: WeatherAtLocation) {
    const weather = await this.readOneByCity(location.locationName);
    if (!weather) {
      await this.createOne(location);
      return;
    }
    weather.data = location as Record<string, any>;
    await this.weatherRepository.save(weather);
  }

  async updateCurrentWeather(result: WeatherResponseResult) {
    for (const location of result.locations) {
      await this.updateCurrentWeatherByLocation(location);
    }
  }
}
