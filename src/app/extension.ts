import { Root, CustomHelpers, ExtensionBoundSchema } from 'joi';

/* ------------------------------- Joi Related ------------------------------ */
const stringDigitRules = ['checkUppercase', 'checkLowercase', 'checkDigit', 'checkSpecial'] as const;
type TStringDigitRules = Partial<(typeof stringDigitRules)[number]>;

const checkStringDigitRuleMethod = (ruleName: TStringDigitRules, digit: number, extensionBound: ExtensionBoundSchema) =>
  extensionBound.$_addRule({
    name: ruleName,
    args: { digit },
  });

const stringDigitChecker = ({ value, digit }: { value: string; digit: number }, rule: TStringDigitRules, helpers: CustomHelpers<any>) => {
  const regexMatcherCollection: Record<TStringDigitRules, RegExp> = {
    checkUppercase: /[A-Z]/g,
    checkLowercase: /[a-z]/g,
    checkDigit: /\d/g,
    checkSpecial: /[^\w\d]|[$&+,:;=?@#|'<>.^*()%!-]/,
  };
  const stringDigitCheckerCollection: Record<TStringDigitRules, () => any> = {
    ...stringDigitRules.reduce((stringDigitCheckerRule: any, key) => {
      stringDigitCheckerRule[key] = () => {
        const matchChecker = value.match(regexMatcherCollection[key]) ?? [];
        if (matchChecker.length < digit) return helpers.error(`string.${key}`, { value, digit });
        return value;
      };
      return stringDigitCheckerRule;
    }, {}),
  };
  return stringDigitCheckerCollection[rule]();
};

export const joiCustomExtend = (joi: Root) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    ...stringDigitRules.reduce((stringDigitRule: any, key) => {
      const messageModifierCollection: Record<TStringDigitRules, string> = {
        checkUppercase: 'upper',
        checkLowercase: 'lower',
        checkDigit: 'digit',
        checkSpecial: 'special',
      };
      stringDigitRule[`string.${key}`] = `{{#label}} must have at least {{#digit}} ${messageModifierCollection[key]} character`;
      return stringDigitRule;
    }, {}),
  },
  rules: {
    ...stringDigitRules.reduce((stringDigitRule: any, key) => {
      stringDigitRule[key] = {
        method: function (digit: number) {
          return checkStringDigitRuleMethod(key, digit, this as any);
        },
        validate: (value: string, helpers: CustomHelpers<any>, { digit }: { digit: number }) => stringDigitChecker({ value, digit }, key, helpers),
      };
      return stringDigitRule;
    }, {}),
  },
});
/* --------------------------- End of Joi Related --------------------------- */
export default undefined;
