/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
