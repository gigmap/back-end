const {Router} = require('express');
const songkickRouter = require('./rest/routes/songkick/router');

const router = new Router();

router.use('/songkick', songkickRouter);

module.exports = router;