import { Injectable } from '@nestjs/common';
import cryptography from '@app/utils/cryptography';

@Injectable()
export class AuthService {
  public async register() {
    return cryptography.hashPassword('password');
  }
}
