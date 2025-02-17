import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'Server Tests',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/utils/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Map ES modules to their CommonJS counterparts
    '^lodash-es$': 'lodash',
    '^lodash-es/(.*)$': 'lodash/$1',
  },
  transformIgnorePatterns: [
    // Transform ES modules in node_modules
    'node_modules/(?!(lodash-es)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['<rootDir>/src/utils/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
};

export default config;
