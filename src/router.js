const {Router} = require('express');
const songkickRouter = require('./rest/routes/songkick/router');
const systemRouter = require('./rest/routes/system/router');
const importRouter = require('./rest/routes/import/router');

const router = new Router();

router.use('/songkick', songkickRouter);
router.use('/import', importRouter);
router.use('/system', systemRouter);

module.exports = router;