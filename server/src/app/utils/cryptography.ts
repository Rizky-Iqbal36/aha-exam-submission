import appConfig from '@app/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { auth } = appConfig;

class Cryptography {
  public createSignature(payload: any, setExpire?: string | number | undefined) {
    return jwt.sign(payload, auth.jwt.secret, {
      expiresIn: setExpire ?? auth.jwt.expiration,
      issuer: auth.jwt.issuer,
    });
  }

  public verifyToken(token: string, jwtSecret?: string) {
    return jwt.verify(token, jwtSecret ?? auth.jwt.secret);
  }

  public hashPassword(pw: string) {
    const salt = bcrypt.genSaltSync();

    return {
      hashedPassword: bcrypt.hashSync(pw, salt),
      salt,
    };
  }

  public comparePassword(pw: string, salt: string) {
    return bcrypt.compareSync(pw, salt);
  }
}

export default new Cryptography();
