const REQUIRED_ENV = ['SONGKICK_API_KEY', 'FRONTEND_ORIGIN'];

const DEFAULT_SONGKICK_BASE_URL = 'https://api.songkick.com/api/3.0';
const TEST_VALUE = 'test';

const createConfig = (isProduction) => {
  if (isProduction) {
    for (let key of REQUIRED_ENV) {
      if (!process.env[key]) {
        throw new Error(`Env var ${key} is required`);
      }
    }
  }

  const {
    SONGKICK_BASE_URL,
    SONGKICK_API_KEY,
    FRONTEND_ORIGIN
  } = process.env;

  return Object.freeze({
    gigmap: {
      frontendOrigin: FRONTEND_ORIGIN
    },
    songkick: {
      baseUrl: SONGKICK_BASE_URL || DEFAULT_SONGKICK_BASE_URL,
      apiKey: SONGKICK_API_KEY || TEST_VALUE
    }
  });
};

module.exports = createConfig;

/**
 * @typedef SongkickConfig
 * @property {string} baseUrl
 * @property {string} apiKey
 */