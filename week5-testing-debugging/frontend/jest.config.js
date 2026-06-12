/**
 * Jest Configuration for CampusLink Placement Portal Frontend
 * Generates coverage reporting targeting > 80% coverage and uses JSDOM
 */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleNameMapper: {
    // Handle CSS/modular CSS styles imports
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Mock graphic assets, svgs, layouts
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/tests/**/*'
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
