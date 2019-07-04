const {expect} = require('chai');
const {describe, it} = require('mocha');
const stripDateFromName =
  require('../../../../../src/rest/routes/songkick/controllers/mappers/stripDateFromName');

describe('stripDateFromName', function () {

  it('should not change a string without date', function () {
    expect(stripDateFromName('a b c')).to.be.equal('a b c');
  });

  it('should remove singe date from the end (case 1)', function () {
    expect(stripDateFromName('Speedometer at Proxima Estacion (July 4, 2019)'))
      .to.be.equal('Speedometer at Proxima Estacion');
  });

  it('should remove singe date from the end (case 2)', function () {
    expect(stripDateFromName('Nebula with Sasquatch at Bottom of the Hill (September 22, 2019)'))
      .to.be.equal('Nebula with Sasquatch at Bottom of the Hill');
  });

  it('should remove only last block of dates', function () {
    expect(stripDateFromName('Gig (July 4, 2019) name (September 22, 2019)'))
      .to.be.equal('Gig (July 4, 2019) name');
  });
});