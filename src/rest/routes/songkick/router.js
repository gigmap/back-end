const {Router} = require('express');
const listConcerts = require('./controllers/listConcerts');
const countArtists = require('./controllers/countArtists');
const addExpressValidation = require('../../middleware/addExpressValidation');
const nameValidator = require('./validation/nameValidator');
const dateValidator = require('./validation/dateValidator');

const router = new Router();

router.get('/artists/count',
  addExpressValidation(nameValidator),
  countArtists());

router.get('/concerts/list',
  addExpressValidation([nameValidator, dateValidator]),
  listConcerts());

module.exports = router;