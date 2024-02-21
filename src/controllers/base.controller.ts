import { ObjectSchema } from 'joi';
import _ from 'lodash';

export class BaseController {
  public async validateReq(schema: ObjectSchema, payload: any) {
    const validationError: any = await this.getValidationErrors(
      schema,
      payload
    );
    if (validationError) throw new Error(validationError[0].message);
  }

  public async getValidationErrors(schema: ObjectSchema, args: any) {
    return schema
      .validateAsync(args)
      .then(() => null)
      .catch((err) => err.details);
  }

  public async checkPayload(data: object) {
    if (_.isEmpty(data)) throw new Error('No Payload');
  }
}
