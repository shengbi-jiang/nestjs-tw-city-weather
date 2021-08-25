import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): string {
    return process.env.NODE_ENV ?? 'development';
  }

  get port(): number {
    return this.configService.get('PORT');
  }

  get dbHost(): string {
    return this.configService.get('DB_HOST');
  }

  get dbPort(): number {
    return this.configService.get('DB_PORT');
  }

  get dbType(): string {
    return this.configService.get('DB_TYPE');
  }

  get dbUser(): string {
    return this.configService.get('DB_USER');
  }

  get dbPassword(): string {
    return this.configService.get('DB_PASSWORD');
  }

  get dbName(): string {
    return this.configService.get('DB_NAME');
  }

  get dbTypeormSync(): boolean {
    return this.configService.get('DB_TYPEORM_SYNC');
  }

  get dbTypeormLog(): string {
    return this.configService.get('DB_TYPEORM_LOG');
  }

  get openWeatherToken(): string {
    return this.configService.get<string>('OPEN_WEATHER_TOKEN');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION');
  }

  get apiUsername(): string {
    return this.configService.get<string>('API_USERNAME');
  }

  get apiPassword(): string {
    return this.configService.get<string>('API_PASSWORD');
  }
}
