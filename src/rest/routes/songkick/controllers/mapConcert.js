/**
 * @param {Object} location
 * @return {string}
 */
const extractCountry = (location) => {
  return location.city.split(', ').pop()
};

const mapConcert = concert => {
  const {id, displayName, uri, location} = concert;
  const result = {id, displayName, uri, location};

  result.start = concert.start.date;
  result.members = concert.performance.map(it => it.artist.id);
  result.location.country = extractCountry(result.location);
  result.relatedArtistNames = [];

  return result;
};

module.exports = mapConcert;