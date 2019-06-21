const {expect} = require('chai');
const {describe, it} = require('mocha');
const mapCountry =
  require('../../../../../src/rest/routes/songkick/controllers/mappers/mapCountry');

describe('mapCountry', function () {

  it('should make object out of country name', function () {
    const name = 'Some Country';
    expect(mapCountry(name)).to.be.deep.equal({
      id: name,
      displayName: name
    });
  });
});