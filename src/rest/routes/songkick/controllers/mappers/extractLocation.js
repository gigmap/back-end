const {Optional} = require('async-optional');

/**
 * @param {Concert} concert
 * @return {string}
 */
const getCountryFromCity = ({location: {city}}) => city.split(', ').pop();

/**
 * @param {Concert} concert
 * @return {MappedLocation}
 */
const extractLocation = (concert) => {
  return {
    ...concert.location,
    country: Optional.with(concert.venue)
      .take('metroArea')
      .take('country')
      .take('displayName')
      .orCompute(() => getCountryFromCity(concert))
      .get()
  };
};

module.exports = extractLocation;