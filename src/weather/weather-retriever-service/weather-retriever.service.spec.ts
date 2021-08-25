import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from '../../app-config/app-config.service';
import { WeatherService } from '../weather-service/weather.service';
import { WeatherResponseResult } from './weather-response-result.type';
import { WeatherResponse } from './weather-response.type';
import { WeatherRetrieverService, NORMAL_WEATHER_PREDICTION_CODE } from './weather-retriever.service';

interface Answer {
  openWeatherToken?: string;
  weatherResponse?: WeatherResponse;
  weatherResult?: WeatherResponseResult;
}

function createEmptyService() {
  return jest.fn().mockImplementation(() => ({}));
}

describe('WeatherRetrieverService', () => {
  let service: WeatherRetrieverService;

  const answer: Answer = {};

  async function prepare(deps: any = {}) {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherRetrieverService,
        { provide: WeatherService, useValue: deps.WeatherService ?? createEmptyService() },
        { provide: HttpService, useValue: deps.HttpService ?? createEmptyService() },
        { provide: AppConfigService, useValue: deps.AppConfigService ?? createEmptyService() },
      ],
    }).compile();

    service = module.get<WeatherRetrieverService>(WeatherRetrieverService);
  }

  beforeEach(async () => {
    answer.openWeatherToken = 'TOKEN';
    answer.weatherResponse = {
      success: 'true',
      result: {
        resource_id: NORMAL_WEATHER_PREDICTION_CODE,
        fields: [],
      },
      records: {
        datasetDescription: 'datasetDescription',
        location: [],
      },
    };
    answer.weatherResult = {
      locations: [],
    };
  });

  it('should be defined', async () => {
    await prepare();
    expect(service).toBeDefined();
  });

  it('should retrieve the weather data successfully', async () => {
    await prepare({
      AppConfigService: { openWeatherToken: answer.openWeatherToken },
      HttpService: {
        get: jest.fn((url: string) => {
          expect(url).toBe(
            `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${NORMAL_WEATHER_PREDICTION_CODE}?Authorization=${answer.openWeatherToken}&format=JSON`,
          );
          return { toPromise: () => Promise.resolve({ data: answer.weatherResponse }) };
        }),
      },
      WeatherService: {
        updateCurrentWeather: jest.fn(async (result: WeatherResponseResult) => {
          expect(result).toEqual(answer.weatherResult);
        }),
      },
    });

    await service.retrieveCurrentWeather();
  });
});
