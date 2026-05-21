module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/db.test.js', '<rootDir>/test/contactForm.test.js'],
  setupFiles: ['<rootDir>/test/setupEnv.js'],
  collectCoverageFrom: ['src/**/*.js', 'models/**/*.js', '!src/server.js'],
  testTimeout: 30000
};
