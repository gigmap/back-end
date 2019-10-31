const {expect} = require('chai');
const {describe, it} = require('mocha');
const {getBandsFromHtml} =
  require('../../../../../src/rest/routes/import/google/lib/getBandsFromHtml');

const SIMPLE_ARTIST_HTML = '<td data-col="artist" data-matched-id="a123">' +
  '<a class="text" href="" aria-label="Artist: Messa">Messa</a>';
const ESCAPED_ARTIST_HTML =
  '<td data-col="artist" data-matched-id="b345">' +
  '<a class="text" href="" aria-label="Artist: Bonnie &quot;Prince&quot; Billy">Bonnie "Prince" Billy</a>';

const SIMPLE_ARTIST = {id: 'a123', title: 'Messa'};
const ESCAPED_ARTIST = {id: 'b345', title: 'Bonnie "Prince" Billy'};

describe('getBandsFromHtml', function () {

  it('should return empty array on empty input', function () {
    expect(getBandsFromHtml('')).to.be.deep.equal([]);
  });

  it('should return 1 artist from a 1-song playlist', async function () {
    expect(getBandsFromHtml(SIMPLE_ARTIST_HTML))
      .to.be.deep.equal([SIMPLE_ARTIST]);
  });

  it('should return 1 artist from a same-artist-playlist', function () {
    expect(getBandsFromHtml(SIMPLE_ARTIST_HTML + SIMPLE_ARTIST_HTML))
      .to.be.deep.equal([SIMPLE_ARTIST]);
  });

  it('should return several artists', function () {
    expect(getBandsFromHtml(SIMPLE_ARTIST_HTML + ESCAPED_ARTIST_HTML))
      .to.be.deep.equal([SIMPLE_ARTIST, ESCAPED_ARTIST]);
  });

  it('should unescape special characters', function () {
    expect(getBandsFromHtml(ESCAPED_ARTIST_HTML))
      .to.be.deep.equal([ESCAPED_ARTIST]);
  });
});