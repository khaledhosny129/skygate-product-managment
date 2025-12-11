import { IsEnum, IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

import { Environment } from '@core/modules/config/enums/enviroment.enum';

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsIn(Object.values(Environment))
  NODE_ENV = Environment.Development;

  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsString()
  MONGO_URI: string;

  @IsNumber()
  RATE_LIMIT: number;

  @IsString()
  GLOBAL_PREFIX: string;

  @IsString()
  API_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRY: string;

  @IsString()
  ADMIN_EMAIL: string;

  @IsString()
  ADMIN_PASSWORD: string;
}