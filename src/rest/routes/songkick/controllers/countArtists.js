const makeAsyncMiddleware = require('../../../common/makeAsyncMiddleware');
const ErrorMessage = require('../../../common/ErrorMessage');
const {errors: {userNotFound}} = require('../Constants');

const countArtists = () => makeAsyncMiddleware(async (req, res) => {
  const {services} = res.app.locals;
  const {username} = res.locals.input;

  const qty = await services.getSongkickApi().countArtists(username);
  if (qty === null) {
    return res.status(404).json(ErrorMessage.prebuilt(userNotFound));
  }

  res.status(200).json({qty});
});

module.exports = countArtists;