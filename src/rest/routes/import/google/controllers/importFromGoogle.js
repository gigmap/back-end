const makeAsyncMiddleware = require('../../../../common/makeAsyncMiddleware');
const {getBandsFromHtml} = require('../lib/getBandsFromHtml');
const createLogger = require('../../../../../helpers/createLogger');

const logger = createLogger('getGoogleImport');

const importFromGoogle = () => makeAsyncMiddleware(async (req, res) => {
  const {services} = res.app.locals;
  const {username, html} = res.locals.input;

  const bandNames = getBandsFromHtml(html);
  if (bandNames.length === 0) {
    logger.info('No band names found');
    return res.status(200).json([]);
  }

  const songkickApi = services.getSongkickApi();
  const trackedList = await songkickApi.listArtists(username) || [];
  const trackedArtistsIds = trackedList.reduce((ids, artist) => {
    ids[artist.id] = true;
    return ids;
  }, {});

  const result = await Promise.all(bandNames.map(async (googleArtist) => {
    const songkickArtist = await songkickApi.findArtist(googleArtist.title);
    return {
      googleArtist,
      isTracked: Boolean(songkickArtist && trackedArtistsIds[songkickArtist.id]),
      songkickArtist
    };
  }));

  res.status(200).json(result);
});

module.exports = importFromGoogle;