import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { User, userSchema } from '@features/users/entities/user.entity';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { SuperAdminInitService } from '@core/services/super-admin-init.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }])
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    SuperAdminInitService
  ],
  exports: [SuperAdminInitService]
})
export class CoreModule {}
