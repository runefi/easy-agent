/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports =
{
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      "jsc": {
        "parser": {
          "syntax": "typescript",
          "decorators": true
        },
        "transform": {
          "decoratorVersion": "2022-03"
        }
      }
    }]
  }
};
