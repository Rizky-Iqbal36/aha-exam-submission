import express from 'express';
import serverless from 'serverless-http';

import { NestFactory } from '@nestjs/core';
// import { Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './appModule';

// import appConfig from '@app/config';
import TransformInterceptor from '@app/interceptor';

// const logger = new Logger();
async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor());
  app.init();
  // logger.debug(`| App environment: ${appConfig.app.env}`);
  // await app.listen(appConfig.app.port, async () => {
  //   logger.debug(`🚀 Server ready at port: ${appConfig.app.port}`);
  // });
  return expressApp;
}

export const handler = async (event: any, context: any) => serverless(await bootstrap())(event, context);
