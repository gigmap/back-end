const makeAsyncMiddleware = require('../../../common/makeAsyncMiddleware');
const ErrorMessage = require('../../../common/ErrorMessage');
const mapConcert = require('./mapConcert');
const mapArtist = require('./mapArtist');

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

  // const ApiStub = require('./ResultApiStub-Snake');
  // setTimeout(() => res.status(200).json(ApiStub), 2000);
  // return;

  // todo: should be some job pool so request rate isn't insane

  /** @type {MappedArtist[]} */
  const filteredArtists = [];

  /** @type {Map<number, MappedConcert>} */
  const concertsById = new Map();

  /** @type {Set<string>} */
  const countries = new Set();

  await Promise.all(artists.map(async (artist) => {
    const concerts = await songkickApi.listConcerts(artist.id);
    if (concerts.length === 0) {
      return;
    }

    const mappedArtist = mapArtist(artist);
    filteredArtists.push(mappedArtist);
    concerts.forEach(it => {
      if (concertsById.has(it.id)) {
        return concertsById.get(it.id).members.push(mappedArtist);
      }

      const mappedEvent = mapConcert(it);
      mappedEvent.members.push(mappedArtist);
      concertsById.set(it.id, mappedEvent);
      countries.add(mappedEvent.location.country);
    });
  }));

  res.status(200).json({
    countries: Array.from(countries).sort(),
    artists: filteredArtists
      .sort((a, b) => a.displayName > b.displayName ? 1 : -1),
    concerts: Array.from(concertsById.values())
      .sort((a, b) => a.start > b.start ? 1 : -1)
  });
});

module.exports = listConcerts;