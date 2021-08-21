# tw-city-weather-nest

## Description

An API server for Taiwan's weather information.

## Environment File

If the environment variable `NODE_ENV` is not set, the server will access `.env/.env` as the default environment variable file.

Otherwise, it will access `.env/.env.{NODE_ENV}`.

Example for the environment variable file:

```
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_TYPE=postgres
DB_USER=admin
DB_PASSWORD=password
DB_NAME=tw_weather
DB_TYPEORM_SYNC=true
DB_TYPEORM_LOG=all
OPEN_WEATHER_TOKEN=token
```

| Variable           | Description                                                                                                                         |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| PORT               | The server port                                                                                                                     |
| DB_HOST            | The host of the database                                                                                                            |
| DB_PORT            | The port of the database                                                                                                            |
| DB_TYPE            | The type of the database. The supported types are listed [here](https://typeorm.io/#/connection-options/common-connection-options). |
| DB_USER            | The username of the database                                                                                                        |
| DB_PASSWORD        | The password of the database                                                                                                        |
| DB_NAME            | The name of the database                                                                                                            |
| DB_TYPEORM_SYNC    | Indicates if database schema should be auto created on every application launch.                                                    |
| DB_TYPEORM_LOG     | Indicates if logging is enabled or not.                                                                                             |
| OPEN_WEATHER_TOKEN | The authorization token for retrieving open weather data.                                                                           |

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
