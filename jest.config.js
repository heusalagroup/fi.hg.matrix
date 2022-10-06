// See also https://github.com/heusalagroup/test or project specific test folder
/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  globals: {
    window: {}
  }
};
