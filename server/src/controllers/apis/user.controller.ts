import { Controller, Get, Res } from '@nestjs/common';

import { IResponse } from '@src/interfaces';

import { BaseController } from '../base.controller';
import { UserService } from '@service/user.service';

@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('list')
  public async userList(@Res() res: IResponse) {
    return this.userService.userList(res.locals.user);
  }

  @Get('profile')
  public async profile(@Res() res: IResponse) {
    return this.userService.profile(res.locals.user);
  }

  @Get('statistic')
  public async statistic(){
    return this.userService.statistic()
  }
}
