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
JWT_SECRET=jwt_secret
JWT_EXPIRATION=30d
API_USERNAME=api_username
API_PASSWORD=api_password
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
| JWT_SECRET         | The secret of JSON web tokens. (API Keys)                                                                                           |
| JWT_EXPIRATION     | The expiration of JSON web tokens in describing a time span [zeit/ms](https://github.com/vercel/ms)                                 |
| API_USERNAME       | The username for getting a new JSON web token.                                                                                      |
| API_PASSWORD       | The password for getting a new JSON web token.                                                                                      |

## Installation

```bash
$ npm install
```

## Running the app locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app using `docker-compose` (Development)

If you have [Docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) installed, you can execute the following script to build up, run, and remove the service quickly.

```bash
# Set the environment variables that are required by `docker-compose.yml`.
# The variables below should be identical to the variables in the file `.env/.env`.
$ export DB_USER=db_user
$ export DB_PASSWORD=db_password
$ export DB_NAME=db_name
$ export PORT=port

# Builds, (re)creates, starts, and attaches to containers for this service.
$ docker-compose up

# Stops containers and removes containers, networks, volumes, and images created by `up`.
$ docker-compose down -v
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
