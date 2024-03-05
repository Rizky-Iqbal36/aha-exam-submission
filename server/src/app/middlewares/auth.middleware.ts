import { Request, NextFunction } from 'express';

import { NestMiddleware, Injectable } from '@nestjs/common';

import { IResponse } from '@src/interfaces';
import { EFlag } from '@src/interfaces/enum';

import { Unauthorized, BadRequest, Forbidden } from '@app/exception';
import cryptography from '@app/utils/cryptography';

import UserRepository from '@repository/user.repository';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userRepositry: UserRepository) {}

  async use(req: Request, res: IResponse, next: NextFunction) {
    let header, token;

    if (!(header = req.header('Authorization')) || !(token = header.replace('Bearer ', ''))) throw new Unauthorized({ reason: 'Token Required' });

    let user;
    try {
      const verified = cryptography.verifyToken(token) as any;
      user = await this.userRepositry.findOne({ where: { id: verified.id } });
      if (user) {
        res.locals.user = {
          id: user.id,
          email: user.email,
          isEmailVerified: !!user.emailVerificationDate,
        };
        this.userRepositry.update({ id: user.id }, { lastSessionDate: () => 'NOW()' });
      }
    } catch (err: any) {
      throw new BadRequest({ flag: EFlag.INVALID_JWT, reason: err.message }, { message: 'Invalid Token' });
    }

    if (!user) throw new Forbidden({});

    next();
  }
}
