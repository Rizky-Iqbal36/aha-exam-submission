import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { IResponse } from '@src/interfaces';

import UserRepository from '@repository/user.repository';

import { Forbidden } from '@app/exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async userList(user: IResponse['locals']['user']) {
    if (!user.isEmailVerified) throw new Forbidden({ reason: 'Email not verified yet', resendLink: '' });

    const users = await this.userRepository.find();
    return {
      data: users.map(({ id, email, loginCount: totalLogin, emailVerificationDate, insertDate }) => ({
        id,
        email,
        totalLogin,
        lastSessionDate: null,
        emailVerificationDate: emailVerificationDate ? moment(emailVerificationDate).format('LLL') : '-',
        registrationDate: moment(insertDate).format('LLL'),
      })),
    };
  }
}
