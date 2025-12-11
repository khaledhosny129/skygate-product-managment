import { ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { join } from 'path';

import { initSwagger } from '@docs/swagger';
import { BadRequestException } from '@core/exceptions';


export function configure(
  app: NestExpressApplication,
  configService: ConfigService
): void {
  app.useStaticAssets(join(__dirname, '..', 'upload'));

  app.setGlobalPrefix(configService.get<string>('GLOBAL_PREFIX') || 'api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.set('trust proxy', 1);
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  app.use(
    helmet(),
    compression(),
    cookieParser(),
    session({
      secret: configService.get<string>('JWT_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProd,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      }
    }),

    passport.initialize(),

    passport.session(),

    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: configService.get<number>('RATE_LIMIT') || 100,
      message: 'Too many requests, please try again later.'
    })
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: false,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const validationErrors = errors.map((error: ValidationError) => {
        const field = error.property;
        const constraints = error.constraints || {};
        const message = Object.values(constraints)[0] || `${field} is invalid`;
        
        return {
          field,
          message
        };
      });

      return new BadRequestException(
        'Validation failed',
        {
          code: 'VALIDATION_ERROR',
          details: validationErrors
        }
      );
    }
  }));

  const allowedOrigins = ['http://localhost:3000'];

  app.enableCors({
    credentials: true,
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });

  initSwagger(app);
}
