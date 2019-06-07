const {query} = require('express-validator/check/index');

module.exports = query('username').isString().not().isEmpty();