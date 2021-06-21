/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

module.exports = {
  env: { browser: true, node: true },
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2015 },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    //'@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-duplicate-imports': 'error',
    //'@typescript-eslint/complexity': 'error',
    '@typescript-eslint/no-empty-function': 'warn'
    //'@typescript-eslint/curly': 'error',
    //'@typescript-eslint/yoda': 'warn',
    //'@typescript-eslint/max-len': ['warn', {"code": 150 ,"ignoreUrls": true}]
  }
};
