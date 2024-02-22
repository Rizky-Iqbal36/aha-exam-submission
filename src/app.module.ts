import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import ExceptionsFilter from '@app/exception/filter';
import TransformInterceptor from '@app/interceptor';

import { databaseAha } from '@src/database';
import controllers from '@src/controllers';
import services from '@src/services';
import repositories from '@src/repositories';

@Module({
  imports: [databaseAha],
  controllers,
  providers: [...services, ...repositories, { provide: APP_FILTER, useClass: ExceptionsFilter }, { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
})
export class AppModule {}
