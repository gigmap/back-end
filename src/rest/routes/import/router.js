const {Router} = require('express');
const addExpressValidation = require('../../middleware/addExpressValidation');
const importFromGoogle = require('./google/controllers/importFromGoogle');
const googleImportValidators = require('./google/controllers/validators');

const router = new Router();

router.post('/google',
  addExpressValidation(googleImportValidators),
  importFromGoogle());

module.exports = router;