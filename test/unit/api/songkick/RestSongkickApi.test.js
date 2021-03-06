const {expect} = require('chai');
const {describe, it} = require('mocha');
const sinon = require('sinon');
const ClientStub = require('../../../lib/api/songkick/AxiosStub');
const RestSongkickApi = require('../../../../src/api/songkick/RestSongkickApi');

const TRACKED_ARTISTS_EXAMPLE = require('../../rest/routes/songkick/fixtures/TrackedArtistsExample');
const EMPTY_CALENDAR_EXAMPLE = require('../../rest/routes/songkick/fixtures/EmptyCalendarExample');
const CALENDAR_EXAMPLE = require('../../rest/routes/songkick/fixtures/CalendarExample');
const EMPTY_SEARCH = require('../../rest/routes/songkick/fixtures/EmptySearchExample');
const FULFILLED_SEARCH = require('../../rest/routes/songkick/fixtures/SearchExample');
const USER = 'user';
const ARTIST_ID = 123;

describe('RestSongkickApi', function () {

  describe('countArtists', function () {
    const ARTIST_QTY = 3;

    it('should return null if user not found', async function () {
      const api = new RestSongkickApi(ClientStub.withError(404));
      const result = await api.countArtists(USER);
      expect(result).to.be.null;
    });

    it('should throw error on incorrect request', function () {
      const api = new RestSongkickApi(ClientStub.withError(401));
      return expect(api.countArtists(USER)).to.eventually.be.rejected;
    });

    it('should throw error if no response received', function () {
      const api = new RestSongkickApi(ClientStub.withNoResponse());
      return expect(api.countArtists(USER)).to.eventually.be.rejected;
    });

    it('should return qty of user\'s artists', async function () {
      const api = new RestSongkickApi(ClientStub.withData(TRACKED_ARTISTS_EXAMPLE));
      expect(await api.countArtists(USER)).to.be.equal(ARTIST_QTY);
    });
  });

  describe('listArtists', function () {
    it('should return null if user not found', async function () {
      const api = new RestSongkickApi(ClientStub.withError(404));
      const result = await api.listArtists(USER);
      expect(result).to.be.null;
    });

    it('should throw error on incorrect request', function () {
      const api = new RestSongkickApi(ClientStub.withError(401));
      return expect(api.listArtists(USER)).to.eventually.be.rejected;
    });

    it('should return user\'s artists', async function () {
      const api = new RestSongkickApi(ClientStub.withData(TRACKED_ARTISTS_EXAMPLE));
      expect(await api.listArtists(USER))
        .to.be.deep.equal([...TRACKED_ARTISTS_EXAMPLE.resultsPage.results.artist]);
    });
  });

  describe('listConcerts', function () {
    it('should throw error on incorrect request', function () {
      const api = new RestSongkickApi(ClientStub.withError(401));
      return expect(api.listConcerts(ARTIST_ID)).to.eventually.be.rejected;
    });

    it('should return empty array if there are no concerts', async function () {
      const api = new RestSongkickApi(ClientStub.withData(EMPTY_CALENDAR_EXAMPLE));
      expect(await api.listConcerts(ARTIST_ID)).to.be.deep.equal([]);
    });

    it('should return artist concerts', async function () {
      const api = new RestSongkickApi(ClientStub.withData(CALENDAR_EXAMPLE));
      expect(await api.listConcerts(ARTIST_ID))
        .to.be.deep.equal([...CALENDAR_EXAMPLE.resultsPage.results.event]);
    });

    it('should use dated as parameters', async function () {
      const client = ClientStub.withStubs(EMPTY_CALENDAR_EXAMPLE);
      const api = new RestSongkickApi(client);

      await api.listConcerts(ARTIST_ID, '2019-02-06', '2019-02-10');

      sinon.assert.calledOnce(client.get);
      sinon.assert.calledWithExactly(client.get,
        `/artists/${ARTIST_ID}/calendar.json`,
        {params: {min_date: '2019-02-06', max_date: '2019-02-10'}});
    });
  });

  describe('findArtist', function () {
    it('should return null f nothing found', async function () {
      const api = new RestSongkickApi(ClientStub.withData(EMPTY_SEARCH));
      expect(await api.findArtist('name'))
        .to.be.deep.equal(null);
    });

    it('should return artist array', async function () {
      const api = new RestSongkickApi(ClientStub.withData(FULFILLED_SEARCH));
      expect(await api.findArtist('name'))
        .to.be.deep.equal({
          id: 357052,
          displayName: '1000mods',
          uri: 'http://www.songkick.com/artists/599905-monkey3?utm_source=55872&utm_medium=partner',
        });
    });
  });
});