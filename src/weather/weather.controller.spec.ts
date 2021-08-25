import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather-service/weather.service';
import { WeatherController } from './weather.controller';

describe('WeatherController', () => {
  let controller: WeatherController;

  async function prepare(deps: any = {}) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: WeatherService, useValue: deps.WeatherService ?? {} }],
      controllers: [WeatherController],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    return deps;
  }

  it('should be defined', async () => {
    await prepare();
    expect(controller).toBeDefined();
  });

  describe('getManyWeathers', () => {
    it('should return an array of weather data', async () => {
      const WEATHERS = [{ data: 'SAMPLE1' }, { data: 'SAMPLE2' }];
      const deps = await prepare({
        WeatherService: {
          readMany: jest.fn(async () => WEATHERS),
        },
      });

      const weathers = await controller.getManyWeathers();
      expect(weathers).toBe(WEATHERS);
      expect(deps.WeatherService.readMany).toBeCalled();
    });
  });

  describe('getWeather', () => {
    it('should return the weather data of a specified city', async () => {
      const CITY_NAME = 'Taipei';
      const WEATHER = { data: 'SAMPLE' };
      const deps = await prepare({
        WeatherService: {
          mustReadOneByCity: jest.fn(async (city: string) => {
            expect(city).toBe(CITY_NAME);
            return WEATHER;
          }),
        },
      });

      const data = await controller.getWeather(CITY_NAME);
      expect(data).toBe(WEATHER.data);
      expect(deps.WeatherService.mustReadOneByCity).toBeCalledWith(CITY_NAME);
    });

    it('should not catch any exception', async () => {
      const CITY_NAME = 'XYZ';
      const notFoundException = new NotFoundException();
      const deps = await prepare({
        WeatherService: {
          mustReadOneByCity: jest.fn(async (city: string) => {
            expect(city).toBe(CITY_NAME);
            throw notFoundException;
          }),
        },
      });

      try {
        await controller.getWeather(CITY_NAME);
        fail('The controller should not catch any exception');
      } catch (err) {
        expect(err).toBe(notFoundException);
        expect(deps.WeatherService.mustReadOneByCity).toBeCalledWith(CITY_NAME);
      }
    });
  });
});
