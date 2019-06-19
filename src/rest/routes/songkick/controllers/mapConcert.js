/**
 * @param {ConcertLocation} location
 * @return {string}
 */
const extractCountry = (location) => {
  return location.city.split(', ').pop();
};

/**
 * @param {ConcertLocation} location
 * @return {MappedLocation}
 */
const mapLocation = (location) => {
  return {
    ...location,
    country: extractCountry(location)
  };
};

// TODO: add venue id? get location from venue?

/**
 * @param {Concert} concert
 * @return {MappedConcert}
 */
const mapConcert = concert => {
  const {id, displayName, uri, location, start} = concert;
  return {
    id,
    displayName,
    uri,
    location: mapLocation(location),
    start: start.date,
    members: []
  };
};

module.exports = mapConcert;