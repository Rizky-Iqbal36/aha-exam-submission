import { Response } from 'express';
import _ from 'lodash';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { EFlag } from '@src/interfaces/enum';

import { CustomHttpException } from '@app/exception';

@Catch(HttpException, Error)
export default class ExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors;
    let result;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      result = status !== 200 ? undefined : exception.getResponse();

      let flag = undefined,
        details = {};
      if (exception instanceof CustomHttpException) {
        const { flag: custom_flag, ...etc } = (exception as CustomHttpException)
          .details;
        flag = custom_flag;
        details = etc;
      }

      errors = {
        result: 0,
        desc: exception.message,
        flag,
        ...{ ...(!_.isEmpty(details) && { details }) },
      };
    } else if (exception instanceof Error) {
      errors = {
        result: 0,
        desc: 'Internal Server Error',
        flag: EFlag.INTERNAL_SERVER_ERROR,
        detail: {
          ...exception,
          reason: exception.message,
        },
      };
    }

    status >= 300
      ? ((result = undefined), (errors = { ...errors, statusCode: status }))
      : (errors = undefined);
    res.status(status).json({
      ...(typeof result === 'object' ? (result as object) : { result }),
      ...errors,
    });
  }
}
