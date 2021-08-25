import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve as pathResolve } from 'path';
import { AppConfigService } from './app-config.service';
import { CONFIG_SCHEMA } from './config-schema';

function getEnvFileName(): string {
  const { NODE_ENV } = process.env;
  const environment = NODE_ENV ?? '';
  return environment.length > 0 ? `.env.${NODE_ENV}` : '.env';
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: pathResolve('.env', getEnvFileName()),
      validationSchema: CONFIG_SCHEMA,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
