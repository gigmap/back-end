const ErrorMessage = require('../common/ErrorMessage');
const INTERNAL = 'INTERNAL';
const logger = require('../../helpers/createLogger')('handleInternalError');

// eslint-disable-next-line no-unused-vars
module.exports = (isProduction) => (err, req, res, next) => {
  const isException = err instanceof Error;
  let responseData;

  if (isException) {
    logger.error(err);

    responseData = isProduction ?
      ErrorMessage.prebuilt(INTERNAL) :
      ErrorMessage.prebuilt(INTERNAL, {message: err.message, stack: err.stack});
  } else {
    responseData = err.body;
  }

  res
    .status(isException ? 500 : err.status)
    .json(responseData);
};

/**
 * @typedef {Object} EndpointError
 * @property {number} status
 * @property {Object} body
 */