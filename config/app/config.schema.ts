import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_ID: Joi.string().uuid({ version: 'uuidv8' }).required(),
  NODE_ENV: Joi.string().required(),
  PORT: Joi.string().required(),
  URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_TIME: Joi.string().required(),
  JWT_CONFIRMATION_SECRET: Joi.string().required(),
  JWT_CONFIRMATION_TIME: Joi.string().required(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_TIME: Joi.string().required(),
  JWT_REFRESH_TIME: Joi.string().required(),
  REFRESH_COOKIE: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.string().required(),
  EMAIL_SECURE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
});
