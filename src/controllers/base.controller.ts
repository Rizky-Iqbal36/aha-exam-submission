import { ObjectSchema } from 'joi';
import _ from 'lodash';
import { BadRequest } from '@app/exception';
import { EFlag } from '@src/interfaces/enum';

export class BaseController {
  public async validateReq(
    schema: ObjectSchema,
    payload: any,
    flag: EFlag = EFlag.INVALID_BODY
  ) {
    const validationError: any = await this.getValidationErrors(
      schema,
      payload
    );
    if (validationError)
      throw new BadRequest(
        { flag, reason: validationError[0].message },
        { message: 'Invalid Payload' }
      );
  }

  public async getValidationErrors(schema: ObjectSchema, args: any) {
    return schema
      .validateAsync(args)
      .then(() => null)
      .catch((err) => err.details);
  }

  public async checkPayload(data: object) {
    if (_.isEmpty(data))
      throw new BadRequest(
        { flag: EFlag.DATA_EMPTY },
        { message: 'No Payload' }
      );
  }
}
