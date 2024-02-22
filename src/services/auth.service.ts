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

  public async verification({ email }: { email: string }) {
    return {
      result: true,
    };
  }
}
