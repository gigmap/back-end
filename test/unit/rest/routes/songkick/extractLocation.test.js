const {expect} = require('chai');
const {describe, it} = require('mocha');
const extractLocation =
  require('../../../../../src/rest/routes/songkick/controllers/mappers/extractLocation');

const SAMPLE_CONCERT = require('./fixtures/EventExample');
const EXPECTED_RESULT = {
  city: 'Copenhagen, Denmark',
  lat: 55.6761,
  lng: 12.56834,
  country: 'Denmark'
};


describe('mapConcert', function () {

  it('should extract country from venue', function () {
    expect(extractLocation(SAMPLE_CONCERT))
      .to.be.deep.equal({...EXPECTED_RESULT});
  });

  it('should extract country from city', function () {
    expect(extractLocation({
      ...SAMPLE_CONCERT,
      venue: {}
    }))
      .to.be.deep.equal({...EXPECTED_RESULT});
  });
});