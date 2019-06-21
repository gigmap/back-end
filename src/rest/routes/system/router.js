const {Router} = require('express');
const getVersion = require('./getVersion');

const router = new Router();

router.get('/version', getVersion());


module.exports = router;