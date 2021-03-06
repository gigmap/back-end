const makeAsyncMiddleware = require('../../../common/makeAsyncMiddleware');
const ErrorMessage = require('../../../common/ErrorMessage');
const mapConcert = require('./mappers/mapConcert');
const mapArtist = require('./mappers/mapArtist');
const mapCountry = require('./mappers/mapCountry');
const checkTimeInterval = require('../validation/checkTimeInterval');
const {CONCERT_STATUS} = require('../../../../api/songkick/Constants');
const {makeAttendanceMap} = require('./mappers/makeAttendanceMap');

const {errors: {userNotFound}} = require('../Constants');
// const logger = require('../../../../helpers/createLogger')('listConcerts');

const listConcerts = () => makeAsyncMiddleware(async (req, res) => {
  const {services, config} = res.app.locals;
  const {username, from, to} = res.locals.input;

  const checkResult = checkTimeInterval(from, to, config.gigmap.maxTimePeriodDays);
  if (!checkResult.valid) {
    return res.status(400).json(ErrorMessage.prebuilt(checkResult.error));
  }

  const songkickApi = services.getSongkickApi();
  const [artists, attendanceData] = await Promise.all([
    songkickApi.listArtists(username),
    songkickApi.getUserAttendance(username)
  ]);
  if (artists === null) {
    return res.status(404).json(ErrorMessage.prebuilt(userNotFound));
  }

  /** @type {Object<string, string>} */
  const attendance = makeAttendanceMap(attendanceData);

  // todo: should be some job pool so request rate isn't insane

  /** @type {MappedArtist[]} */
  const filteredArtists = [];

  /** @type {Map<number, MappedConcert>} */
  const concertsById = new Map();

  /** @type {Set<string>} */
  const countries = new Set();

  await Promise.all(artists.map(async (artist) => {
    const concerts = await songkickApi.listConcerts(artist.id, from, to);
    if (concerts.length === 0) {
      return;
    }

    const mappedArtist = mapArtist(artist);
    filteredArtists.push(mappedArtist);
    concerts
      .filter(it => it.status !== CONCERT_STATUS.CANCELLED)
      .forEach(it => {
        if (concertsById.has(it.id)) {
          return concertsById.get(it.id).members.push(mappedArtist);
        }

        const mappedEvent = mapConcert(it, attendance[it.id]);
        mappedEvent.members.push(mappedArtist);
        concertsById.set(it.id, mappedEvent);
        countries.add(mappedEvent.location.country);
      });
  }));

  res.status(200).json({
    countries: Array.from(countries).sort().map(mapCountry),
    artists: filteredArtists
      .sort((a, b) => a.displayName > b.displayName ? 1 : -1),
    concerts: Array.from(concertsById.values())
      .sort((a, b) => a.start > b.start ? 1 : -1)
  });
});

module.exports = listConcerts;