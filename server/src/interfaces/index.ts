import { Response } from 'express';
import { EFlag } from './enum';

/* ---------------------------- Typescript Helper --------------------------- */
export interface IObject {
  [key: string]: any;
}
export type IObjMerger<T> = IObject & T;
/* ------------------------ END of Typescript Helper ------------------------ */

/* ------------------------ Request Response Related ------------------------ */
export interface IResponse extends Response {
  locals: IObjMerger<{
    user: { id: number; email: string; isEmailVerified: boolean };
  }>;
}
/* --------------------- End of Request Response Related -------------------- */

/* ----------------------------- Message Related ---------------------------- */
export interface ILocalizeMessage {
  key: string;
  vars?: object;
  lang?: string;
}
export interface IMessageOption {
  localeMessage?: ILocalizeMessage;
  message?: string;
}
/* ------------------------- END of Message Related ------------------------- */

/* ------------------------ Request Response Related ------------------------ */
export interface IDetailException extends IObject {
  flag: EFlag;
}
/* --------------------- END of Request Response Related -------------------- */
