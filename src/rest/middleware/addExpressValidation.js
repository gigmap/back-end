const handleExpressValidation = require('./handleExpressValidation');

const addExpressValidation = (validators) => {
  if (Array.isArray(validators)) {
    return [
      ...validators,
      handleExpressValidation()
    ];
  }

  return [validators, handleExpressValidation()];
};

module.exports = addExpressValidation;