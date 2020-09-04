const {body} = require('express-validator');

module.exports = [
  body('username').isString().not().isEmpty(),
  body('html').isString().not().isEmpty()
];