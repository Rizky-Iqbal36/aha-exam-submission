import express from 'express';
import serverless from 'serverless-http';

import { NestFactory } from '@nestjs/core';
// import { Logger } from '@nestjs/common';

import { AppModule } from './appModule';

import appConfig from '@app/config';
import { Forbidden } from '@app/exception';
import TransformInterceptor from '@app/interceptor';

// const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || appConfig.app.allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Forbidden({ reason: 'CORS Error' }));
    },
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(express.json({ limit: '101mb' }));
  app.use(express.urlencoded({ limit: '101mb', extended: true }));
  await app.init();
  // logger.debug(`| App environment: ${appConfig.app.env}`);
  // await app.listen(appConfig.app.port, async () => {
  //   logger.debug(`🚀 Server ready at port: ${appConfig.app.port}`);
  // });
  return app.getHttpAdapter().getInstance();
}
// bootstrap()
export const handler = async (event: any, context: any) => serverless(await bootstrap())(event, context);
