const pino = require('pino');
const EnvHelper = require('./EnvHelper');

const BASIC_OPTIONS = Object.freeze({
  useLevelLabels: true,
  level: EnvHelper.isProduction ? 'info' : 'debug'
});

/**
 * @param {string} module
 * @return {P.Logger}
 */
const createLogger = (module) => {
  if (EnvHelper.isTesting) {
    return pino({enabled: false});
  }

  const options = {
    ...BASIC_OPTIONS,
    base: {module}
  };

  if (EnvHelper.isProduction) {
    return pino(options);
  }

  return pino({
    ...options,
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:HH:MM:ss.l yyyy-mm-dd'
    }
  });
};

module.exports = createLogger;