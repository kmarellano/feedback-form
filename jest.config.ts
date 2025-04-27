import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({});

export default {
  ...presetConfig,
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/gql$': '<rootDir>/src/graphql',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/context/(.*)$': '<rootDir>/src/types/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
} satisfies Config;
