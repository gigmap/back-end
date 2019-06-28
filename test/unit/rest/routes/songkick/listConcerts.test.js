const {expect} = require('chai');
const {describe, it} = require('mocha');
const {
  ResponseBuilder,
  RequestBuilder,
  formatResponseError,
  createRouteTestRunner,
  getApiService
} = require('../../../../lib');
const router = require('../../../../../src/rest/routes/songkick/router');
const NoTrackedArtistsExample = require('./fixtures/NoTrackedArtistsExample');
const EmptyCalendarExample = require('./fixtures/EmptyCalendarExample');
const TrackedArtists = require('./fixtures/TrackedArtists');
const Artist1Calendar = require('./fixtures/Artist1Calendar');
const Artist2Calendar = require('./fixtures/Artist2Calendar');

describe('listConcerts', function () {

  const USER = 'xxx';

  /** @type {(function(RequestBuilder, ResponseBuilder): Promise<Object>)} */
  const runRouter = createRouteTestRunner(router);

  const req = new RequestBuilder()
    .get('/concerts/list')
    .withQuery({username: USER});

  const res = new ResponseBuilder()
    .withConfig({gigmap: {maxTimePeriodDays: -1}});

  const makeAnswer = (countries, artists, concerts) =>
    ({countries, artists, concerts});

  describe('input data validation', () => {
    describe('checking username', function () {
      it('should send error on absence of username', async function () {
        const answer = await runRouter(req.withQuery({}), res);

        expect(answer).to.haveOwnProperty('error');
        const {status, body: {errors}} = answer.error;

        expect(status).to.be.equal(400);
        expect(errors).to.be.an('array').lengthOf(2);
        for (let {code} of errors) {
          expect(code).to.be.equal('VALIDATION');
        }
      });

      it('should send error on empty username', async function () {
        const answer = await runRouter(req.withQuery({username: ''}), res);

        expect(answer).to.haveOwnProperty('error');
        const {status, body: {errors}} = answer.error;

        expect(status).to.be.equal(400);
        expect(errors).to.be.an('array').lengthOf(1);
        expect(errors[0].code).to.be.equal('VALIDATION');
      });

      it('should handle non-existing songkick username', async function () {
        const result =
          await runRouter(req, res.withServices(getApiService(404, true)));

        result.__stubs.checkAnswer(404, formatResponseError('SONGKICK_USER_NOT_FOUND'));
      });

    });

    describe('checking dates', function () {
      it('should send error on having only `from` date', async function () {
        const answer = await runRouter(
          req.withQuery({username: USER, from: '2019-01-01'}), res);

        expect(answer).to.haveOwnProperty('error');
        const {status, body: {errors}} = answer.error;

        expect(status).to.be.equal(400);
        expect(errors).to.be.an('array').lengthOf(1);
        expect(errors[0].code).to.be.equal('VALIDATION');
      });

      it('should send error on having only `to` date', async function () {
        const answer = await runRouter(
          req.withQuery({username: USER, to: '2019-01-01'}), res);

        expect(answer).to.haveOwnProperty('error');
        const {status, body: {errors}} = answer.error;

        expect(status).to.be.equal(400);
        expect(errors).to.be.an('array').lengthOf(1);
        expect(errors[0].code).to.be.equal('VALIDATION');
      });

      it('should send error on incorrect date format', async function () {
        const answer = await runRouter(
          req.withQuery({username: USER, from: 'abc', to: '12/12/2019'}), res);

        expect(answer).to.haveOwnProperty('error');
        const {status, body: {errors}} = answer.error;

        expect(status).to.be.equal(400);
        expect(errors).to.be.an('array').lengthOf(2);
        expect(errors[0].code).to.be.equal('VALIDATION');
      });

      it('should return error if `to` if before `from`', async () => {
        const answer = await runRouter(
          req.withQuery({
            username: USER,
            from: '2019-05-06',
            to: '2019-05-02'
          }), res);

        answer.__stubs.checkAnswer(400, formatResponseError('INVALID_TIME_INTERVAL'));
      });

      it('should return error if time interval is longer than allowed', async () => {
        const answer = await runRouter(
          req.withQuery({
            username: USER,
            from: '2019-05-06',
            to: '2019-05-10'
          }), res.withConfig({gigmap: {maxTimePeriodDays: 2}}));

        answer.__stubs.checkAnswer(400, formatResponseError('TIME_INTERVAL_TOO_LONG'));
      });

      it('should accept valid time interval', async () => {
        const answer = await runRouter(
          req.withQuery({
            username: USER,
            from: '2019-05-06',
            to: '2019-05-10'
          }),
          res.withConfig({gigmap: {maxTimePeriodDays: 10}})
            .withServices(getApiService(NoTrackedArtistsExample))
        );

        answer.__stubs.checkAnswer(200, makeAnswer([], [], []));
      });
    });

    it('should send error on songkick system error', async function () {
      const answer =
        await runRouter(req, res.withServices(getApiService(401, true)));

      expect(answer).to.haveOwnProperty('error');
      expect(answer.error).to.be.deep.equal({response: {status: 401}});
    });
  });

  it('should trim time from dates', async function () {
    const answer = await runRouter(
      req.withQuery({
        username: USER,
        from: '2019-05-02T03:33:00.000Z',
        to: '2019-05-06T10:40:00.000Z'
      }), res.withServices(getApiService(NoTrackedArtistsExample)));

    const {from, to} = answer.locals.input;
    expect(from).to.be.equal('2019-05-02');
    expect(to).to.be.equal('2019-05-06');
  });

  it('should return empty arrays on no artists tracked', async function () {
    const result =
      await runRouter(req, res.withServices(getApiService(NoTrackedArtistsExample)));

    result.__stubs.checkAnswer(200, makeAnswer([], [], []));
  });

  it('should return empty arrays if tracked artists have no concerts', async function () {
    const clientData = new Map([
      [`/users/${USER}/artists/tracked.json`, TrackedArtists],
      ['/artists/357052/calendar.json', EmptyCalendarExample],
      ['/artists/4292566/calendar.json', EmptyCalendarExample]
    ]);

    const result =
      await runRouter(req, res.withServices(getApiService(clientData)));

    result.__stubs.checkAnswer(200, makeAnswer([], [], []));
  });

  it('should combine artists calendar data', async function () {
    const clientData = new Map([
      [`/users/${USER}/artists/tracked.json`, TrackedArtists],
      ['/artists/357052/calendar.json', Artist1Calendar],
      ['/artists/4292566/calendar.json', Artist2Calendar]
    ]);

    const result =
      await runRouter(req, res.withServices(getApiService(clientData)));

    result.__stubs.checkAnswer(200, {
      countries: [
        {id: 'Denmark', displayName: 'Denmark'},
        {id: 'Germany', displayName: 'Germany'}
      ],
      artists: [
        {id: 'artist357052', displayName: '1000mods'},
        {id: 'artist4292566', displayName: 'The Bones of J.R. Jones'}
      ],
      concerts: [
        {
          id: 111,
          displayName: 'Copenhell 2019',
          uri: 'http://www.songkick.com/festivals/',
          location: {
            city: 'Copenhagen, Denmark',
            lat: 55.6761,
            lng: 12.56834,
            country: 'Denmark'
          },
          start: '2019-06-19',
          members: [
            {id: 'artist357052', displayName: '1000mods'},
            {id: 'artist4292566', displayName: 'The Bones of J.R. Jones'}
          ]
        },

        {
          id: 333,
          displayName: 'The Bones of J.R. Jones at Club (June 21, 2019)',
          uri: 'http://www.songkick.com/concerts/333',
          location: {
            city: 'Hamburg, Germany',
            lat: 53.5583,
            lng: 9.96765,
            country: 'Germany'
          },
          start: '2019-06-21',
          members: [
            {id: 'artist4292566', displayName: 'The Bones of J.R. Jones'}
          ]
        },

        {
          id: 555,
          displayName: 'Neuborn Open Air Festival 2019',
          uri: 'http://www.songkick.com/festivals/2',
          location: {
            city: 'Berlin, Germany',
            lat: 49.84236,
            lng: 8.11606,
            country: 'Germany'
          },
          start: '2019-08-23',
          members: [{id: 'artist357052', displayName: '1000mods'}]
        }
      ]
    });
  });
});