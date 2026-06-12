/**
 * Jest Configuration for CampusLink Placement Portal Backend
 * Targets standard Node test environment and enforces >80% coverage limits
 */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.ts',
    'routes/**/*.ts',
    'middleware/**/*.ts',
    'models/**/*.ts',
    '!tests/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
