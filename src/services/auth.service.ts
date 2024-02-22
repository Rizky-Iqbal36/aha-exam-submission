import { Injectable } from '@nestjs/common';

import cryptography from '@app/utils/cryptography';
import sendGrid from '@app/providers/sendGrid';
import appConfig from '@app/config';
const { app } = appConfig;

@Injectable()
export class AuthService {
  public async register({ email, password }: { email: string; password: string }) {
    const saltedPw = cryptography.hashPassword(password);
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
    return 'OK';
  }
}
