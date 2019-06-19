const expressValidationHandler = require('./expressValidationHandler');

const addExpressValidation = (validators) => {
  if (Array.isArray(validators)) {
    return [
      ...validators,
      expressValidationHandler
    ];
  }

  return [validators, expressValidationHandler];
};

module.exports = addExpressValidation;