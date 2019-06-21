/**
 * @param {Artist} artist
 * @return {MappedArtist}
 */
const mapArtist = artist => {
  const {id, displayName} = artist;

  return {
    id: `artist${id}`,
    displayName
  };
};

module.exports = mapArtist;