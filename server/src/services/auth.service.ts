import _ from 'lodash';
import { Injectable } from '@nestjs/common';

import cryptography from '@app/utils/cryptography';
import sendGrid from '@app/providers/sendGrid';
import googleOAuth from '@app/providers/googleOAuth';
import appConfig from '@app/config';
import { BadRequest, NotFound, Unauthorized } from '@app/exception';
const { app } = appConfig;

import UserRepository from '@repository/user.repository';
import { EFlag } from '@src/interfaces/enum';
import { IResponse } from '../interfaces';
import UserModel from '../database/models/user.model';

type TAuth = { email: string; password: string };
@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register({ email, password: incomingPw }: TAuth) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequest({ flag: EFlag.BAD_REQUEST }, { message: 'User already registered' });

    const { hashedPassword, salt } = cryptography.hashPassword(incomingPw);
    const signature = cryptography.createSignature({ email });
    await sendGrid.sendEmail({
      recipient: email,
      subject: 'Email Verification | Aha Exam Submission',
      message: `<p>Thank you for signing up</p>
                <p>To complete your registration and activate your account, please click on the following link:</p>
                <p>${app.url}/auth/sign-verification?signature=${signature}</p>
                <p>Best regards,</p>
                <p>M Rizky Ikbal Syaifullah</p>`,
    });

    const { raw } = await this.userRepository.insert({ email, password: hashedPassword, salt, loginCount: 1 });
    const token = cryptography.createSignature({ id: raw.insertId, email });

    return {
      message: 'Register Success',
      user: {
        name: null,
        email,
        profilePicture: null,
        pwSet: true,
        isEmailVerified: false,
      },
      token,
    };
  }

  public async login({ email, password: incomingPw }: TAuth) {
    const invalidCredsException = new BadRequest({ flag: EFlag.BAD_REQUEST }, { message: 'Incorrect email address and / or password.' });
    let user = await this.userRepository.findOne({ select: ['id', 'email', 'name', 'profilePicture', 'emailVerificationDate', 'password', 'loginCount'], where: { email } });
    if (!user || !user.password) throw invalidCredsException;

    const { id, password } = user;
    const comparePw = cryptography.comparePassword(incomingPw, password);
    if (!comparePw) throw invalidCredsException;

    const token = cryptography.createSignature({ id, email });
    await this.userRepository.update({ email }, { loginCount: user.loginCount + 1, lastLoginDate: () => 'NOW()', lastUpdate: () => 'NOW()' });

    let userData: any = _.omit(user, ['id', 'emailVerificationDate', 'password', 'loginCount']);
    userData.isEmailVerified = !!user.emailVerificationDate;
    userData.pwSet = !!user.password;

    return { message: 'Login Success', user: userData, token };
  }

  public async verification({ email }: { email: string }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFound({ flag: EFlag.RESOURCE_NOT_FOUND }, { message: 'Email not found' });

    const token = cryptography.createSignature({ id: user.id, email });
    if (user.emailVerificationDate)
      return {
        result: true,
        token,
        message: 'Email already verified',
      };

    await this.userRepository.update({ email }, { emailVerificationDate: () => 'NOW()', lastUpdate: () => 'NOW()' });
    return {
      result: true,
      token,
      message: 'Email verified',
    };
  }

  public async resendVerification({ email }: IResponse['locals']['user']) {
    const signature = cryptography.createSignature({ email });
    await sendGrid.sendEmail({
      recipient: email,
      subject: 'Email Verification (Resend) | Aha Exam Submission',
      message: `<p>Thank you for signing up</p>
                <p>To complete your registration and activate your account, please click on the following link:</p>
                <p>${app.url}/auth/sign-verification?signature=${signature}</p>
                <p>Best regards,</p>
                <p>M Rizky Ikbal Syaifullah</p>`,
    });
    return {
      message: 'Email Sent, Please check your inbox',
    };
  }

  public async resetPassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { id }: IResponse['locals']['user']) {
    const user = (await this.userRepository.findOne({ select: ['id', 'password'], where: { id } })) as UserModel;
    if (!user.password) throw new BadRequest({ flag: EFlag.BAD_REQUEST }, { message: 'User doesnt set password yet' });

    const comparePw = cryptography.comparePassword(currentPassword, user.password);
    if (!comparePw) throw new Unauthorized({ reason: 'Incorrect password.' });

    const { hashedPassword, salt } = cryptography.hashPassword(newPassword);
    await this.userRepository.update({ id }, { password: hashedPassword, salt });
    return {
      message: 'Success',
    };
  }

  public async setPassword({ newPassword }: { currentPassword: string; newPassword: string }, { id }: IResponse['locals']['user']) {
    const user = (await this.userRepository.findOne({ select: ['id', 'password'], where: { id } })) as UserModel;
    if (user.password) throw new BadRequest({ flag: EFlag.BAD_REQUEST }, { message: 'User already set password' });

    const { hashedPassword, salt } = cryptography.hashPassword(newPassword);
    await this.userRepository.update({ id }, { password: hashedPassword, salt });
    return {
      message: 'Success',
    };
  }

  public async oauthHandler({ code }: { code: string }) {
    const { id_token: idToken, access_token: accessToken } = await googleOAuth.getOAuthToken(code);

    const { email, name, picture: profilePicture } = await googleOAuth.getGoogleUser(idToken, accessToken);
    const user = await this.userRepository.findOne({ where: { email } });
    const { raw } = await this.userRepository.upsert(
      {
        email,
        name: user ? user.name : name,
        profilePicture,
        loginCount: user ? user.loginCount + 1 : 1,
        emailVerificationDate: !user ? () => 'NOW()' : user.emailVerificationDate,
        lastLoginDate: () => 'NOW()',
      },
      ['email']
    );
    const userId = raw.insertId;
    const token = cryptography.createSignature({ id: userId, email });
    return token;
  }
}
