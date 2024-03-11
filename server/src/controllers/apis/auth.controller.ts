import { Request } from 'express';
import CoreJoi, { ObjectSchema } from 'joi';
import { joiCustomExtend } from '@app/extension';
const Joi = CoreJoi.extend(joiCustomExtend) as typeof CoreJoi;
import { Controller, Get, Post, Req, Res } from '@nestjs/common';

import { EFlag } from '@src/interfaces/enum';
import { AuthService } from '@service/auth.service';
import cryptography from '@app/utils/cryptography';
import appConfig from '@app/config';
const { client, app } = appConfig;

import { BaseController } from '../base.controller';
import { IResponse } from '@root/src/interfaces';
import { BadRequest } from '@app/exception';

@Controller()
export class AuthenticationController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('auth/register')
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

  @Post('auth/login')
  public async login(@Req() req: Request, @Res() res: IResponse) {
    const body = req.body;
    const validationSchema: ObjectSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);

    return this.authService.login(body);
  }

  @Get('auth/oauth')
  public async oauthHandler(@Req() req: Request, @Res() res: IResponse) {
    const query = req.query as any;
    const validationSchema: ObjectSchema = Joi.object({
      code: Joi.string().required(),
    }).unknown();
    const validation = await this.validateReq(validationSchema, query, EFlag.INVALID_PARAM).catch((err) => {
      res.redirect(client.url);
      return false;
    });
    if (validation) {
      const token = await this.authService.oauthHandler(query);
      res.redirect(client.url + `/onboard?token=${token}`);
    }
  }

  @Get('logout')
  public async logout(@Res() res: IResponse) {
    // Flow terminate token
    // const token = res.locals.user.token
    return {
      message: 'Success',
    };
  }

  @Get('email/resend-verification')
  public async resendVerification(@Res() res: IResponse) {
    return this.authService.resendVerification(res.locals.user);
  }

  @Post('password/reset')
  public async resetPassword(@Req() req: Request, @Res() res: IResponse) {
    const body = req.body;
    body.currentPassword = (body?.currentPassword ?? '').trim();
    body.newPassword = (body?.newPassword ?? '').trim();
    body.confirmPassword = (body?.confirmPassword ?? '').trim();

    if (body.newPassword !== body.confirmPassword)
      throw new BadRequest({ flag: EFlag.BAD_REQUEST, reason: 'password not same' }, { message: 'New Password And confirm Password are not the same' });

    const validationSchema: ObjectSchema = Joi.object({
      currentPassword: Joi.string().min(8).required(),
      newPassword: Joi.string().min(8).checkUppercase(1).checkLowercase(1).checkDigit(1).checkSpecial(1).required(),
      confirmPassword: Joi.string().min(8).checkUppercase(1).checkLowercase(1).checkDigit(1).checkSpecial(1).required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);

    return this.authService.resetPassword(body, res.locals.user);
  }

  @Post('password/set')
  public async setPassword(@Req() req: Request, @Res() res: IResponse) {
    const body = req.body;
    body.newPassword = (body?.newPassword ?? '').trim();
    body.confirmPassword = (body?.confirmPassword ?? '').trim();

    if (body.newPassword !== body.confirmPassword)
      throw new BadRequest({ flag: EFlag.BAD_REQUEST, reason: 'password not same' }, { message: 'New Password And confirm Password are not the same' });

    const validationSchema: ObjectSchema = Joi.object({
      newPassword: Joi.string().min(8).checkUppercase(1).checkLowercase(1).checkDigit(1).checkSpecial(1).required(),
      confirmPassword: Joi.string().min(8).checkUppercase(1).checkLowercase(1).checkDigit(1).checkSpecial(1).required(),
    }).unknown();
    await this.validateReq(validationSchema, body, EFlag.INVALID_BODY);

    return this.authService.setPassword(body, res.locals.user);
  }

  @Get('auth/sign-verification')
  public async signVerification(@Req() req: Request, @Res() res: IResponse) {
    const query = req.query;
    const validationSchema: ObjectSchema = Joi.object({
      signature: Joi.string().required(),
    }).unknown();
    await this.validateReq(validationSchema, query, EFlag.INVALID_PARAM);
    const signature = query.signature as string;
    const { email } = cryptography.verifyToken(signature) as any;

    const { token } = await this.authService.verification({ email });
    res.redirect(client.url + `/onboard?token=${token}`);
  }
}
