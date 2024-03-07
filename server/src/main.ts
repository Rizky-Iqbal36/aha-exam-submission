import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

import appConfig from '@app/config';
import TransformInterceptor from '@app/interceptor';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new TransformInterceptor());
  logger.debug(`| App environment: ${appConfig.app.env}`);
  await app.listen(appConfig.app.port, async () => {
    logger.debug(`🚀 Server ready at port: ${appConfig.app.port}`);
  });
}
bootstrap();
