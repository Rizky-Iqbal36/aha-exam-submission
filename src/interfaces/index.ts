import { EFlag } from './enum';

/* ---------------------------- Typescript Helper --------------------------- */
export interface IObject {
  [key: string]: any;
}
/* ------------------------ END of Typescript Helper ------------------------ */

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
