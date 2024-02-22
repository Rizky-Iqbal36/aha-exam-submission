import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import ExceptionsFilter from '@app/exception/filter';
import TransformInterceptor from '@app/interceptor';
import AuthMiddleware from '@app/middlewares/auth.middleware';

import { databaseAha } from '@src/database';
import controllers from '@src/controllers';
import services from '@src/services';
import repositories from '@src/repositories';

@Module({
  imports: [databaseAha],
  controllers,
  providers: [...services, ...repositories, { provide: APP_FILTER, useClass: ExceptionsFilter }, { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude({ path: '/auth/(.*)', method: RequestMethod.ALL }).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
