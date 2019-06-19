const REQUIRED_ENV = ['SONGKICK_API_KEY'];

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
    SONGKICK_API_KEY
  } = process.env;

  return Object.freeze({
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