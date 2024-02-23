import { Injectable } from '@nestjs/common';

import cryptography from '@app/utils/cryptography';
import sendGrid from '@app/providers/sendGrid';
import appConfig from '@app/config';
import { BadRequest, NotFound } from '@app/exception';
const { app } = appConfig;

import UserRepository from '@repository/user.repository';
import { EFlag } from '@src/interfaces/enum';

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
                <p>${app.url}/auth/verification?signature=${signature}</p>
                <p>Best regards,</p>
                <p>M Rizky Ikbal Syaifullah</p>`,
    });
    await this.userRepository.insert({ email, password: hashedPassword, salt });
    return 'OK';
  }

  public async login({ email, password: incomingPw }: TAuth) {
    const invalidCredsException = new BadRequest({ flag: EFlag.BAD_REQUEST }, { message: 'Incorrect email address and / or password.' });
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw invalidCredsException;

    const { id, password } = user;
    const comparePw = cryptography.comparePassword(incomingPw, password);
    if (!comparePw) throw invalidCredsException;

    const token = cryptography.createSignature({ id, email });
    await this.userRepository.update({ email }, { loginCount: user.loginCount + 1, lastLoginDate: () => 'NOW()', lastUpdate: () => 'NOW()' });
    return { message: 'Login Success', token };
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
}
