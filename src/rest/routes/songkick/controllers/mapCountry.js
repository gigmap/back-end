/**
 * @param {string} it
 * @return {{displayName: string, id: string}}
 */
const mapCountry = (it) => ({
  id: it,
  displayName: it
});

module.exports = mapCountry;