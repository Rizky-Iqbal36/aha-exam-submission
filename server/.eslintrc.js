module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: ['airbnb-typescript/base', 'prettier', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: __dirname + '/tsconfig.build.json',
    tsconfigRootDir: __dirname + '/src',
  },
  ignorePatterns: ['dist'],
  rules: {
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-useless-constructor': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-unused-expressions': 0,
  },
};
