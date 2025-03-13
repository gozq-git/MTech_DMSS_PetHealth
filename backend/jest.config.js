// filepath: /Users/venkatkrishna/Documents/TEST/MTech_DMSS_PetHealth/backend/jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts']
  };