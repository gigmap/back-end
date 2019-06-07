const PROD_ENV = 'production';
const DEV_ENV = 'development';
const TEST_ENV = 'test';
const CURRENT_ENV = process.env.NODE_ENV;

const isEnv = env => env === CURRENT_ENV;

module.exports = {
  isProduction: isEnv(PROD_ENV),
  isDevelopment: isEnv(DEV_ENV),
  isTesting: isEnv(TEST_ENV)
};