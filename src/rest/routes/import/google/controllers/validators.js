const {body} = require('express-validator/check/index');

module.exports = [
  body('username').isString().not().isEmpty(),
  body('html').isString().not().isEmpty()
];