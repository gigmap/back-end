const {expect} = require('chai');
const {describe, it} = require('mocha');
const {
  ResponseBuilder,
  RequestBuilder,
  createRouteTestRunner,
  useStubForApiService
} = require('../../../../lib');
const ClientStub = require('../../../../lib/api/songkick/AxiosStub');

const router = require('../../../../../src/rest/routes/import/router');
const TrackedArtistsExample = require('../songkick/fixtures/TrackedArtistsExample');
const SearchExample = require('../songkick/fixtures/SearchExample');
const EmptySearchExample = require('../songkick/fixtures/EmptySearchExample');
const SIMPLE_ARTIST_HTML = '<td data-col="artist" data-matched-id="a123">' +
  '<a class="text" href="" aria-label="Artist: 1000mods">1000mods</a>';

const ensureValidationErrors = (answer) => {
  const {status, body: {errors}} = answer.error;
  expect(status).to.be.equal(400);
  for (let {code} of errors) {
    expect(code).to.be.equal('VALIDATION');
  }
};

describe('importFromGoogle', function () {

  /** @type {(function(RequestBuilder, ResponseBuilder): Promise<Object>)} */
  const runRouter = createRouteTestRunner(router);

  const req = new RequestBuilder()
    .post('/google');

  const res = new ResponseBuilder();

  describe('validators', () => {
    [
      {html: 'code'},
      {username: '', html: 'code'},
      {username: 'some', html: ''},
      {username: 'some'}
    ].forEach((data) =>
      it(`should response with 400 for data: ${JSON.stringify(data)}`, async function () {
        const answer = await runRouter(req.withBody(data), res);
        expect(answer).to.haveOwnProperty('error');
        ensureValidationErrors(answer);
      }));
  });

  it('should return empty array if html has no artists', async function () {
    const answer =
      await runRouter(req.withBody({username: 'ok', html: 'code'}), res);
    answer.__stubs.checkAnswer(200, []);
  });

  it('should return mark artist as tracked', async function () {
    const username = 'TheUser';
    const services = useStubForApiService(ClientStub.withData(new Map([
      [`/users/${username}/artists/tracked.json`, TrackedArtistsExample],
      ['/search/artists.json', SearchExample]
    ])));

    const answer =
      await runRouter(
        req.withBody({username: username, html: SIMPLE_ARTIST_HTML}),
        res.withServices(services)
      );
    answer.__stubs.checkAnswer(200, [{
      googleArtist: {id: 'a123', title: '1000mods'},
      isTracked: true,
      songkickArtist: {
        displayName: '1000mods',
        id: 357052,
        uri: 'http://www.songkick.com/artists/599905-monkey3?utm_source=55872&utm_medium=partner'
      }
    }]);
  });

  it('should return artist without songkick info', async function () {
    const username = 'TheUser';
    const services = useStubForApiService(ClientStub.withData(new Map([
      [`/users/${username}/artists/tracked.json`, TrackedArtistsExample],
      ['/search/artists.json', EmptySearchExample]
    ])));

    const answer =
      await runRouter(
        req.withBody({username: username, html: SIMPLE_ARTIST_HTML}),
        res.withServices(services)
      );
    answer.__stubs.checkAnswer(200, [{
      googleArtist: {id: 'a123', title: '1000mods'},
      isTracked: false,
      songkickArtist: null
    }]);
  });

});