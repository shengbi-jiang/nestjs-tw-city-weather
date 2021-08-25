import { HttpService, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import Axios, { AxiosError } from 'axios';
import { AppConfigService } from '../../app-config/app-config.service';
import { WeatherService } from '../weather-service/weather.service';
import { WeatherResponseResult } from './weather-response-result.type';
import { WeatherResponse } from './weather-response.type';

export const NORMAL_WEATHER_PREDICTION_CODE = 'F-C0032-001';
export const REQUIRED_CITY_SET = new Set(['臺北市', '新北市', '桃園市']);
export const RETRY_TIMES = 5;

const CONTINUE_SIGNAL = Symbol();

@Injectable()
export class WeatherRetrieverService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WeatherRetrieverService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  onApplicationBootstrap() {
    this.retrieveCurrentWeather();
  }

  private getCurrentWeatherUrl(dataId: string): string {
    const token = this.configService.openWeatherToken;
    return `https://opendata.cwb.gov.tw/api/v1/rest/datastore/${dataId}?Authorization=${token}&format=JSON`;
  }

  private examineResult(data: WeatherResponse) {
    if (data.success !== 'true') {
      this.logger.warn("Failed to retrieve the current weather data: 'success' is not 'true'");
      throw CONTINUE_SIGNAL;
    }
  }

  private extractWeatherResult(data: WeatherResponse): WeatherResponseResult {
    const { records } = data;
    const locations = records.location.filter((loc) => REQUIRED_CITY_SET.has(loc.locationName));
    return { locations };
  }

  private async processRetrievingCurrentWeather(url: string) {
    const { data } = await this.httpService.get<WeatherResponse>(url).toPromise();
    this.examineResult(data);
    const weatherResult = this.extractWeatherResult(data);
    await this.weatherService.updateCurrentWeather(weatherResult);
  }

  private async handleAxiosError(err: AxiosError<any>, times: number) {
    let message = `Failed to retrieve the latest current weather at the ${times} times.\n`;
    if (err.response) {
      message += `Response status: ${err.response.status}\n`;
      message += `Response body: ${JSON.stringify(err.response.data, null, 4)}\n`;
    } else if (err.request) {
      message += 'No response from the open weather data server.\n';
    } else {
      message += `An error occurred when setting up the request: ${err.message}\n`;
    }
    this.logger.error(message);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async retrieveCurrentWeather() {
    const url = this.getCurrentWeatherUrl(NORMAL_WEATHER_PREDICTION_CODE);
    let tries = 1;
    while (tries <= RETRY_TIMES) {
      try {
        await this.processRetrievingCurrentWeather(url);
        break;
      } catch (err) {
        if (err === CONTINUE_SIGNAL) continue;
        if (Axios.isAxiosError(err)) {
          this.handleAxiosError(err, tries);
        } else {
          this.logger.error(err);
        }
      }
      ++tries;
    }

    if (tries >= RETRY_TIMES) {
      this.logger.error(`Failed to retrieve the latest weather data after ${RETRY_TIMES} times attempts`);
    } else {
      this.logger.log('Successfully retrieved the latest weather data.');
    }
  }
}
