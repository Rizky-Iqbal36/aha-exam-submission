import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { IResponse } from '@src/interfaces';

import UserRepository from '@repository/user.repository';

import { Forbidden } from '@app/exception';
import UserModel from '../database/models/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async userList(user: IResponse['locals']['user']) {
    if (!user.isEmailVerified) throw new Forbidden({ reason: 'Email not verified yet', resendLink: '' });

    const users = await this.userRepository.find();
    return {
      data: users.map(({ id, email, name, profilePicture, loginCount: totalLogin, lastSessionDate, emailVerificationDate, insertDate }) => ({
        id,
        profilePicture,
        email,
        name: name ?? '-',
        totalLogin,
        lastSessionDate: lastSessionDate ? moment(lastSessionDate).format('LLL') : '-',
        emailVerificationDate: emailVerificationDate ? moment(emailVerificationDate).format('LLL') : '-',
        registrationDate: moment(insertDate).format('LLL'),
      })),
    };
  }

  public async profile({ email, isEmailVerified }: IResponse['locals']['user']) {
    let user = (await this.userRepository.findOne({ select: ['email', 'name', 'profilePicture'], where: { email } })) as UserModel;
    return { ...user, isEmailVerified };
  }
}
