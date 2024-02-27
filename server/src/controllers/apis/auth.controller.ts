import { Request } from 'express';
import CoreJoi, { ObjectSchema } from 'joi';
import { joiCustomExtend } from '@app/extension';
const Joi = CoreJoi.extend(joiCustomExtend) as typeof CoreJoi;
import { Controller, Get, Post, Req, Res } from '@nestjs/common';

import { EFlag } from '@src/interfaces/enum';
import { AuthService } from '@service/auth.service';
import cryptography from '@app/utils/cryptography';
import appConfig from '@app/config';
const { client } = appConfig;

import { BaseController } from '../base.controller';
import { IResponse } from '@root/src/interfaces';

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

  @Post('login')
  public async login(@Req() req: Request) {
    const body = req.body;
    const validationSchema: ObjectSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);

    return this.authService.login(body);
  }

  @Get('oauth')
  public async oauthHandler(@Req() req: Request, @Res() res: IResponse) {
    const query = req.query as any;
    const validationSchema: ObjectSchema = Joi.object({
      code: Joi.string().required(),
    }).unknown();
    await this.validateReq(validationSchema, query, EFlag.INVALID_PARAM);

    const token = await this.authService.oauthHandler(query);
    res.cookie('accessToken', token);
    res.redirect(client.url + '/dashboard');
  }

  @Get('verification')
  public async verification(@Req() req: Request) {
    const query = req.query;
    const validationSchema: ObjectSchema = Joi.object({
      signature: Joi.string().required(),
    }).unknown();
    await this.validateReq(validationSchema, query, EFlag.INVALID_PARAM);
    const signature = query.signature as string;
    const { email } = cryptography.verifyToken(signature) as any;

    return this.authService.verification({ email });
  }
}