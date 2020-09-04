const {query} = require('express-validator');

module.exports = query('username').isString().not().isEmpty();