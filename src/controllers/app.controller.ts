import { Controller, Get } from '@nestjs/common';
import appConfig from '@app/config';
import moment from 'moment';
import 'moment-duration-format';

@Controller()
export class AppController {
  @Get('/health')
  public async healthCheck() {
    return {
      name: appConfig.app.name,
      version: appConfig.app.version,
      environment: appConfig.app.env,
      uptime: moment
        .duration(process.uptime(), 'seconds')
        .format('h [hrs] : m [min] : s [sec]', { trim: false }),
    };
  }
}
