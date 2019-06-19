const {expect} = require('chai');
const {describe, it} = require('mocha');
const mapArtist =
  require('../../../../../src/rest/routes/songkick/controllers/mapArtist');

const SAMPLE_ARTIST = {
  id: 123,
  displayName: 'some name'
};

describe('mapArtist', function () {

  it('should change artist id', function () {
    expect(mapArtist(SAMPLE_ARTIST)).to.be.deep.equal({
      id: 'artist123',
      displayName: 'some name'
    });
  });
});