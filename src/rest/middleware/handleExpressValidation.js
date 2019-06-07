const {validationResult} = require('express-validator/check/index');
const {matchedData} = require('express-validator/filter/index');
const makeResponse = require('./makeResponse');
const ErrorMessage = require('../common/ErrorMessage');
const VALIDATION_CODE = 'VALIDATION';

// todo: necessity of standalone factory function (?)
const handleExpressValidation = () => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = new ErrorMessage();
    errors.array().forEach(it => message.add(VALIDATION_CODE, it));

    return next(makeResponse(400, message));
  }

  res.locals.input = matchedData(req);
  next();
};

module.exports = handleExpressValidation;