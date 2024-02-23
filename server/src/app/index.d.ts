export {};

declare module 'joi' {
  interface StringSchema {
    checkUppercase(length: number): this;
    checkLowercase(length: number): this;
    checkDigit(length: number): this;
    checkSpecial(length: number): this;
  }
}
