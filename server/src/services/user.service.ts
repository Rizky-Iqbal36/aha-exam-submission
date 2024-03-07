import _ from 'lodash';
import moment from 'moment';
import { Injectable } from '@nestjs/common';

import { IResponse } from '@src/interfaces';

import UserRepository from '@repository/user.repository';
import UserSessionRepository from '@repository/userSession.repository';

import { Forbidden } from '@app/exception';
import UserModel from '../database/models/user.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userSessionRepository: UserSessionRepository
  ) {}

  public async userList(user: IResponse['locals']['user']) {
    if (!user.isEmailVerified) throw new Forbidden({ reason: 'Email not verified yet', resendLink: '' });

    const users = await this.userRepository.userWithLastSession();
    return {
      data: users.map(({ id, email, name, profilePicture, loginCount: totalLogin, lastSessionDate, emailVerificationDate, insertDate }) => ({
        id,
        profilePicture,
        email,
        name: name ?? '-',
        totalLogin,
        lastSessionDate: lastSessionDate ? moment(lastSessionDate).format('LL') : '-',
        emailVerificationDate: emailVerificationDate ? moment(emailVerificationDate).format('LL') : '-',
        registrationDate: moment(insertDate).format('LL'),
      })),
    };
  }

  public async editProfile({ name }: { name: string }, { id }: IResponse['locals']['user']) {
    await this.userRepository.update({ id }, { name });
    return { message: 'Success' };
  }

  public async profile({ email, isEmailVerified }: IResponse['locals']['user']) {
    let user = (await this.userRepository.findOne({ select: ['email', 'name', 'profilePicture'], where: { email } })) as UserModel;
    return { ...user, isEmailVerified };
  }

  public async statistic() {
    const totalUser = await this.userRepository.count();
    const userActiveSessionToday = (await this.userSessionRepository.userActiveSessionOnLastNDay(1))[0] ?? { activeUser: 0 };

    const userActiveSession7Day = await this.userSessionRepository.userActiveSessionOnLastNDay(7);
    const totalUserActive7Day = _.sumBy(userActiveSession7Day, ({ activeUser }) => Number(activeUser));

    return {
      totalUser,
      userActiveToday: Number(userActiveSessionToday.activeUser),
      avrgActiveUser: (totalUserActive7Day > 0 ? totalUserActive7Day / 7 : 0).toFixed(2),
    };
  }
}
