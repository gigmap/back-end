const ErrorMessage = require('../common/ErrorMessage');

/**
 * @param {number} status
 * @param {ErrorMessage|string} message
 * @return {{body: *, status: *}}
 */
const makeResponse = (status, message) => {
  const result = {status};
  if (message instanceof ErrorMessage) {
    result.body = message.build();
  } else {
    result.body = ErrorMessage.prebuilt(message);
  }

  return result;
};

module.exports = makeResponse;