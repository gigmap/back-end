const {expect} = require('chai');
const {describe, it} = require('mocha');
const mapConcert =
  require('../../../../../src/rest/routes/songkick/controllers/mappers/mapConcert');

const SAMPLE_CONCERT = require('./fixtures/EventExample');

describe('mapConcert', function () {
  const EXPECTED_RESULT = {
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
  };

  it('should create country object from country name', function () {
    expect(mapConcert(SAMPLE_CONCERT)).to.be.deep.equal(EXPECTED_RESULT);
  });

  it('should add festival flag', function () {
    expect(mapConcert({
      ...SAMPLE_CONCERT,
      type: 'Festival'
    })).to.be.deep.equal({
      ...EXPECTED_RESULT,
      isFestival: true
    });
  });
});