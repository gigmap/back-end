const extractLocation = require('./extractLocation');
const stripDateFromName = require('./stripDateFromName');

/**
 * @param {Concert} concert
 * @return {MappedConcert}
 */
const mapConcert = concert => {
  const {id, displayName, uri, start} = concert;
  return {
    id,
    displayName: stripDateFromName(displayName),
    uri,
    location: extractLocation(concert),
    start: start.date,
    members: []
  };
};

module.exports = mapConcert;