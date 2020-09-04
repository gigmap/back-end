const {query} = require('express-validator');

const FROM = 'from';
const TO = 'to';
const ERROR_MESSAGE = `Both ${FROM} and ${TO} are required`;

const createValidator = (field, requiredField) => query(field).optional()
  .isISO8601()
  .custom((value, {req}) => {
    if (!req.query[requiredField]) {
      throw new Error(ERROR_MESSAGE);
    }

    return true;
  })
  .customSanitizer(value => value.substr(0, 10)); // just YYYY-MM-DD

module.exports = [
  createValidator('from', 'to'),
  createValidator('to', 'from')
];