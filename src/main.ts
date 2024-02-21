import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './app/config';
import { Logger } from '@nestjs/common';
const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appConfig.app.port, async () => {
    logger.debug(`🚀 Server ready at port: ${appConfig.app.port}`);
  });
}
bootstrap();
