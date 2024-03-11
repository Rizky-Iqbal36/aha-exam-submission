import { Injectable, ArgumentsHost } from '@nestjs/common';
import { IResponse } from '../interfaces';
import { Forbidden } from '@app/exception';

@Injectable()
export class EmailGuard {
  canActivate(context: ArgumentsHost) {
    const request: IResponse = context.switchToHttp().getResponse();
    const user = request.locals?.user;
    if (!user?.isEmailVerified) throw new Forbidden({ reason: 'Email not verified' });

    return true;
  }
}
