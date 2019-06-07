const REQUIRED_ENV = ['SONGKICK_API_KEY', 'GOOGLE_API_KEY'];

const createConfig = (isProduction) => {
  if (isProduction) {
    for (let key of REQUIRED_ENV) {
      if (!process.env[key]) {
        throw new Error(`Env var ${key} is required`);
      }
    }
  }

  return Object.freeze({
    songkick: {
      baseUrl: 'https://api.songkick.com/api/3.0',
      apiKey: process.env.SONGKICK_API_KEY || 'test',
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY || 'test',
    }
  });
};

module.exports = createConfig;

/**
 * @typedef SongkickConfig
 * @property {string} baseUrl
 * @property {string} apiKey
 */