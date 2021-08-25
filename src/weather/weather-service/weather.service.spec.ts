import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, FindConditions } from 'typeorm';
import { Weather } from '../weather.entity';
import {
  WeatherResponseResult,
  Location as WeatherAtLocation,
} from '../weather-retriever-service/weather-response-result.type';
import { WeatherService } from './weather.service';

function createWeather(city = 'Taipei') {
  const weather = new Weather();
  weather.id = 'UUID';
  weather.city = city;
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

  describe('readMany', () => {
    it('should return an array of weather data', async () => {
      const WEATHERS = [createWeather('Taipei'), createWeather('Tainan')];
      const deps = await prepare({
        WeatherRepository: {
          find: jest.fn(async () => WEATHERS),
        },
      });

      const weathers = await service.readMany();
      expect(weathers).toBe(WEATHERS);
      expect(deps.WeatherRepository.find).toBeCalled();
    });
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

  describe('createOne', () => {
    it('should create a new weather data', async () => {
      const LOCATION: WeatherAtLocation = {
        locationName: 'Taipei',
        weatherElement: [],
      };
      const WEATHER = createWeather();

      const deps = await prepare({
        WeatherRepository: {
          create: jest.fn((entityLike: DeepPartial<Weather>) => {
            expect(entityLike.id).toEqual(expect.any(String));
            expect(entityLike.city).toBe(LOCATION.locationName);
            expect(entityLike.data).toBe(LOCATION);
            return WEATHER;
          }),
          save: jest.fn(async (entity: Weather) => {
            expect(entity).toBe(WEATHER);
            return entity;
          }),
        },
      });

      const weather = await service.createOne(LOCATION);
      expect(weather).toBe(WEATHER);
      expect(deps.WeatherRepository.create).toBeCalled();
      expect(deps.WeatherRepository.save).toBeCalled();
    });
  });

  describe('updateCurrentWeather', () => {
    it('should create a new weather and update an existing weather data', async () => {
      const TAIPEI_CITY = 'Taipei';
      const TAINAN_CITY = 'Tainan';

      const TAIPEI_WEATHER_LOCATION: WeatherAtLocation = {
        locationName: TAIPEI_CITY,
        weatherElement: [],
      };

      const TAINAN_WEATHER_LOCATION: WeatherAtLocation = {
        locationName: TAINAN_CITY,
        weatherElement: [],
      };

      const TAIPEI_WEATHER = new Weather();
      TAIPEI_WEATHER.id = 'UUID-TAIPEI';
      TAIPEI_WEATHER.city = TAIPEI_CITY;
      TAIPEI_WEATHER.data = {}; // assume it's old data

      const TAINAN_WEATHER = new Weather();
      TAINAN_WEATHER.id = 'UUID-TAINAN';
      TAINAN_WEATHER.city = TAINAN_CITY;
      TAINAN_WEATHER.data = TAINAN_WEATHER_LOCATION as any;

      const input: WeatherResponseResult = {
        locations: [TAIPEI_WEATHER_LOCATION, TAINAN_WEATHER_LOCATION],
      };

      const deps = await prepare({
        WeatherRepository: {
          findOne: jest.fn(async (conditions: FindConditions<Weather>) => {
            expect(conditions).toBeDefined();
            expect(conditions.city).toEqual(expect.any(String));
            if (conditions.city === TAIPEI_WEATHER.city) {
              return TAIPEI_WEATHER;
            } else if (conditions.city === TAINAN_WEATHER.city) {
              return null;
            } else {
              fail(`Out of test cases - unknown city: ${conditions.city}`);
            }
          }),
          create: jest.fn((entityLike: DeepPartial<Weather>) => {
            expect(entityLike.id).toEqual(expect.any(String));
            expect(entityLike.city).toBe(TAINAN_WEATHER_LOCATION.locationName);
            expect(entityLike.data).toBe(TAINAN_WEATHER_LOCATION);
            return TAINAN_WEATHER;
          }),
          save: jest.fn(async (entity: Weather) => {
            if (entity.city === TAIPEI_WEATHER.city) {
              expect(entity.data).toBe(TAIPEI_WEATHER_LOCATION);
            } else if (entity.city === TAINAN_WEATHER.city) {
              expect(entity.data).toBe(TAINAN_WEATHER_LOCATION);
            } else {
              fail(`Out of test cases - unknown city: ${entity.city}`);
            }
            return entity;
          }),
        },
      });

      await service.updateCurrentWeather(input);
      expect(deps.WeatherRepository.findOne).toBeCalledTimes(2);
      expect(deps.WeatherRepository.create).toBeCalledTimes(1);
      expect(deps.WeatherRepository.save).toBeCalledTimes(2);
    });
  });
});
