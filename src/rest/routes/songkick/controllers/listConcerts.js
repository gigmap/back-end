const makeAsyncMiddleware = require('../../../common/makeAsyncMiddleware');
const ErrorMessage = require('../../../common/ErrorMessage');
const mapConcert = require('./mapConcert');

const {errors: {userNotFound}} = require('../Constants');
const logger = require('../../../../helpers/createLogger')('listConcerts');

const listConcerts = () => makeAsyncMiddleware(async (req, res) => {
  const {services} = res.app.locals;
  const {username} = res.locals.input;
  const songkickApi = services.getSongkickApi();

  const artists = await songkickApi.listArtists(username);
  if (artists === null) {
    return res.status(404).json(ErrorMessage.prebuilt(userNotFound));
  }

  // const ApiStub = require('./ApiStub');
  // setTimeout(() => res.status(200).json(ApiStub), 2000);
  // return;

  // todo: should be some job pool so request rate isn't insane
  const filteredArtists = [];
  const concertsById = new Map();
  const countries = new Set();

  await Promise.all(artists.map(async (artist) => {
    const concerts = await songkickApi.listConcerts(artist.id);
    if (concerts.length === 0) {
      return;
    }

    filteredArtists.push(artist);
    concerts.forEach(it => {
      if (concertsById.has(it.id)) {
        // immutable ?
        const concert = concertsById.get(it.id);
        concert.relatedArtistNames.push(artist.displayName);
        return;
      }


      const mappedEvent = mapConcert(it);
      mappedEvent.relatedArtistNames.push(artist.displayName);
      concertsById.set(it.id, mappedEvent);
      countries.add(mappedEvent.location.country);
    });
  }));

  // todo: members can be filtered down to related artists

  res.status(200).json({
    countries: Array.from(countries).sort(),
    artists: filteredArtists.sort(),
    concerts: Array.from(concertsById.values())
  });
});

module.exports = listConcerts;