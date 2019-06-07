const ErrorMessage = require('../common/ErrorMessage');
const NOT_FOUND = 'ENDPOINT_NOT_FOUND';

module.exports = () => (req, res) => {
  res.status(404).json(ErrorMessage.prebuilt(NOT_FOUND));
};