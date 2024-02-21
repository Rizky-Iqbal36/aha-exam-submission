import { Module } from '@nestjs/common';
import controllers from './controllers';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers,
  providers: [AppService],
})
export class AppModule {}
