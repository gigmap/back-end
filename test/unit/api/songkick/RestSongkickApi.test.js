const {expect} = require('chai');
const {describe, it} = require('mocha');

const ClientStub = require('../../../lib/api/songkick/AxiosStub');
const RestSongkickApi = require('../../../../src/api/songkick/RestSongkickApi');

const TRACKED_ARTISTS_EXAMPLE = require('../../rest/routes/songkick/fixtures/TrackedArtistsExample');
const EMPTY_CALENDAR_EXAMPLE = require('../../rest/routes/songkick/fixtures/EmptyCalendarExample');
const CALENDAR_EXAMPLE = require('../../rest/routes/songkick/fixtures/CalendarExample');
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
      expect(await api.listConcerts(USER)).to.be.deep.equal([]);
    });

    it('should return artist concerts', async function () {
      const api = new RestSongkickApi(ClientStub.withData(CALENDAR_EXAMPLE));
      expect(await api.listConcerts(USER))
        .to.be.deep.equal([...CALENDAR_EXAMPLE.resultsPage.results.event]);
    });
  });
});