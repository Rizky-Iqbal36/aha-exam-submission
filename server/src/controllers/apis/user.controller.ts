import Joi, { ObjectSchema } from 'joi';
import { Request } from 'express';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';

import { IResponse } from '@src/interfaces';

import { BaseController } from '../base.controller';
import { UserService } from '@service/user.service';
import { EFlag } from '@root/src/interfaces/enum';

@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Get('list')
  public async userList(@Res() res: IResponse) {
    return this.userService.userList(res.locals.user);
  }

  @Post('profile')
  public async editProfile(@Req() req: Request, @Res() res: IResponse) {
    const body = req.body;
    const validationSchema: ObjectSchema = Joi.object({
      name: Joi.string().required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);

    return this.userService.editProfile(body, res.locals.user);
  }

  @Get('profile')
  public async profile(@Res() res: IResponse) {
    return this.userService.profile(res.locals.user);
  }

  @Get('statistic')
  public async statistic() {
    return this.userService.statistic();
  }
}
