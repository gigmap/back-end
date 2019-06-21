const {expect} = require('chai');
const {describe, it} = require('mocha');
const mapConcert =
  require('../../../../../src/rest/routes/songkick/controllers/mapConcert');

const SAMPLE_CONCERT = require('./fixtures/EventExample');

describe('mapConcert', function () {

  it('should create country object from country name', function () {
    expect(mapConcert(SAMPLE_CONCERT)).to.be.deep.equal({
      id: 38125534,
      displayName: 'Copenhell 2019',
      uri: SAMPLE_CONCERT.uri,
      location: {
        city: 'Copenhagen, Denmark',
        lat: 55.6761,
        lng: 12.56834,
        country: 'Denmark'
      },
      start: '2019-06-19',
      members: []
    });
  });
});