/**
 * @param {string} name
 * @return {{displayName: string, id: string}}
 */
const mapCountry = (name) => ({
  id: name,
  displayName: name
});

module.exports = mapCountry;