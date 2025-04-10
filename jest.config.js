/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports =
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
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
