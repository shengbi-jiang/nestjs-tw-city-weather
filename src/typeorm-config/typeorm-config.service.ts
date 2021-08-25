import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AppConfigService } from '../app-config/app-config.service';
import { USED_ENTITIES } from './entity-registration';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    return {
      type: this.appConfigService.dbType as any,
      host: this.appConfigService.dbHost,
      port: this.appConfigService.dbPort,
      username: this.appConfigService.dbUser,
      password: this.appConfigService.dbPassword,
      database: this.appConfigService.dbName,
      synchronize: this.appConfigService.dbTypeormSync,
      autoLoadEntities: true,
      logger: 'simple-console',
      entities: USED_ENTITIES,
    };
  }
}
