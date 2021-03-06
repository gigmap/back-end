const REQUIRED_ENV = ['SONGKICK_API_KEY', 'FRONTEND_ORIGIN'];

const DEFAULT_SONGKICK_BASE_URL = 'https://api.songkick.com/api/3.0';
const TEST_VALUE = 'test';
const DEFAULT_PERIOD_DAYS = -1;
const DEFAULT_MAX_REQUEST_SIZE = '5mb';

/**
 * @param {boolean} isProduction
 * @return {AppConfig}
 */
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
    FRONTEND_ORIGIN,
    MAX_TIME_PERIOD,
    MAX_REQUEST_SIZE
  } = process.env;

  const maxTimePeriod = Number.parseInt(MAX_TIME_PERIOD);

  return Object.freeze({
    gigmap: {
      frontendOrigin: FRONTEND_ORIGIN,
      maxTimePeriodDays: Number.isNaN(maxTimePeriod) ?
        DEFAULT_PERIOD_DAYS :
        maxTimePeriod,
      maxRequestSize: MAX_REQUEST_SIZE || DEFAULT_MAX_REQUEST_SIZE
    },
    songkick: {
      baseUrl: SONGKICK_BASE_URL || DEFAULT_SONGKICK_BASE_URL,
      apiKey: SONGKICK_API_KEY || TEST_VALUE
    }
  });
};

module.exports = createConfig;

/**
 * @typedef {Object} SongkickConfig
 * @property {string} baseUrl
 * @property {string} apiKey
 */

/**
 * @typedef {Object} GigmapConfig
 * @property {string} frontendOrigin
 * @property {number} maxTimePeriodDays
 * @property {string} maxRequestSize
 */

/**
 * @typedef {Object} AppConfig
 * @property {GigmapConfig} gigmap
 * @property {SongkickConfig} songkick
 */