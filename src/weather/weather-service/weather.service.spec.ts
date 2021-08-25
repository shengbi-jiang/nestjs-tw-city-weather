import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindConditions } from 'typeorm';
import { Weather } from '../weather.entity';
import { WeatherService } from './weather.service';

function createWeather() {
  const weather = new Weather();
  weather.id = 'UUID';
  weather.city = 'Taipei';
  weather.data = {};
  return weather;
}

describe('WeatherService', () => {
  let service: WeatherService;

  async function prepare(deps: any = {}) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(Weather),
          useValue: deps.WeatherRepository ?? {},
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    return deps;
  }

  it('should be defined', async () => {
    await prepare();
    expect(service).toBeDefined();
  });

  describe('readOneByCity', () => {
    it('should return weather data when the weather data of a specified city is found', async () => {
      const WEATHER = createWeather();
      const CITY_NAME = WEATHER.city;
      const deps = await prepare({
        WeatherRepository: {
          findOne: jest.fn(async (conditions: FindConditions<Weather>) => {
            expect(conditions).toEqual({ city: CITY_NAME });
            return WEATHER;
          }),
        },
      });

      const weather = await service.readOneByCity(CITY_NAME);
      expect(weather).toBe(WEATHER);
      expect(deps.WeatherRepository.findOne).toBeCalled();
    });

    it('should return null when the weather data of a specified city is not found', async () => {
      const CITY_NAME = 'Tainan';
      const deps = await prepare({
        WeatherRepository: {
          findOne: jest.fn(async (conditions: FindConditions<Weather>) => {
            expect(conditions).toEqual({ city: CITY_NAME });
            return null;
          }),
        },
      });

      const weather = await service.readOneByCity(CITY_NAME);
      expect(weather).toBeNull();
      expect(deps.WeatherRepository.findOne).toBeCalled();
    });
  });

  describe('mustReadOneByCity', () => {
    it('should return weather data when the weather data of a specified city is found', async () => {
      const WEATHER = createWeather();
      const CITY_NAME = WEATHER.city;
      const deps = await prepare({
        WeatherRepository: {
          findOne: jest.fn(async (conditions: FindConditions<Weather>) => {
            expect(conditions).toEqual({ city: CITY_NAME });
            return WEATHER;
          }),
        },
      });

      const weather = await service.mustReadOneByCity(CITY_NAME);
      expect(weather).toBe(WEATHER);
      expect(deps.WeatherRepository.findOne).toBeCalled();
    });

    it('should throw a NotFoundException when the weather data of a specified city is not found', async () => {
      const CITY_NAME = 'Tainan';
      const deps = await prepare({
        WeatherRepository: {
          findOne: jest.fn(async (conditions: FindConditions<Weather>) => {
            expect(conditions).toEqual({ city: CITY_NAME });
            return null;
          }),
        },
      });

      try {
        await service.mustReadOneByCity(CITY_NAME);
        fail('The service should throw a NotFoundException');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(deps.WeatherRepository.findOne).toBeCalled();
      }
    });
  });
});
