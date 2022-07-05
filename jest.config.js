/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  setupFiles: ["<rootDir>/tests/settings/jest.crypto-setup.js"],
};
