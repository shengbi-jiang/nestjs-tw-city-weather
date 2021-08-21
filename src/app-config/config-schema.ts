import * as joi from 'joi';

export const CONFIG_SCHEMA = joi.object({
  PORT: joi.number().port().required(),
  DB_HOST: joi.string().hostname().required(),
  DB_PORT: joi.number().port().required(),
  DB_TYPE: joi.string().required(),
  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_TYPEORM_SYNC: joi.boolean().required(),
  DB_TYPEORM_LOG: joi.string().optional().default('all'),
});
