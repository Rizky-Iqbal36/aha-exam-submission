import { Request, NextFunction } from 'express';
import { Raw } from 'typeorm';

import { NestMiddleware, Injectable } from '@nestjs/common';

import { IResponse } from '@src/interfaces';
import { EFlag } from '@src/interfaces/enum';

import { Unauthorized, BadRequest, Forbidden } from '@app/exception';
import cryptography from '@app/utils/cryptography';

import UserRepository from '@repository/user.repository';
import UserSessionRepository from '@repository/userSession.repository';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userRepositry: UserRepository,
    private readonly userSessionRepository: UserSessionRepository
  ) {}

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
        const sessionRecord = await this.userSessionRepository.findOne({ where: { token, recordCreated: Raw('DATE(NOW())') } });
        await this.userSessionRepository.upsert({ userId: Number(user.id), recordCreated: () => 'CURRENT_DATE()', token, used: sessionRecord?.used ? sessionRecord.used + 1 : 1 }, [
          'userId',
          'recordCreated',
          'token',
        ]);
      }
    } catch (err: any) {
      throw new BadRequest({ flag: EFlag.INVALID_JWT, reason: err.message }, { message: 'Invalid Token' });
    }

    if (!user) throw new Forbidden({});

    next();
  }
}
