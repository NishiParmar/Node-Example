/** @type {import('jest').Config} */

const config = {
  verbose: false,
  silent: true,
  testTimeout: 600000,
  maxWorkers: 1,
  setupFiles: ['<rootDir>/test/unit/setup-tests.js'],
  globalTeardown: '<rootDir>/test/unit/teardown-tests.js',
  testPathIgnorePatterns: ['<rootDir>/test/unit/routes']
}

module.exports = config
