import { joiCustomExtend } from '@app/extension';
import CoreJoi, { ObjectSchema } from 'joi';
const Joi = CoreJoi.extend(joiCustomExtend) as typeof CoreJoi;
import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BaseController } from '../base.controller';
import { AuthService } from '@service/auth.service';
import { EFlag } from '@src/interfaces/enum';

@Controller('auth')
export class AuthenticationController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  public async register(@Req() req: Request) {
    const body = req.body;
    body.password = (body?.password ?? '').trim();
    const validationSchema: ObjectSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).checkUppercase(1).checkLowercase(1).checkDigit(1).checkSpecial(1).required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);

    return this.authService.register(body);
  }
}
