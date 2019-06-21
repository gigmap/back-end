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
const TrackedArtistsExample = require('./fixtures/TrackedArtistsExample');

describe('countArtists', function () {

  /** @type {(function(RequestBuilder, ResponseBuilder): Promise<Object>)} */
  const runRouter = createRouteTestRunner(router);

  const req = new RequestBuilder()
    .get('/artists/count')
    .withQuery({username: 'xxx'});

  const res = new ResponseBuilder();

  it('should pass error absence of username', async function () {
    const answer = await runRouter(req.withQuery({}), res);

    expect(answer).to.haveOwnProperty('error');
    const {status, body: {errors}} = answer.error;

    expect(status).to.be.equal(400);
    expect(errors).to.be.an('array').lengthOf(2);
    for (let {code} of errors) {
      expect(code).to.be.equal('VALIDATION');
    }
  });

  it('should pass error empty username', async function () {
    const answer = await runRouter(req.withQuery({username: ''}), res);

    expect(answer).to.haveOwnProperty('error');
    const {status, body: {errors}} = answer.error;

    expect(status).to.be.equal(400);
    expect(errors).to.be.an('array').lengthOf(1);
    expect(errors[0].code).to.be.equal('VALIDATION');
  });

  it('should pass error on songkick system error', async function () {
    const answer =
      await runRouter(req, res.withServices(getApiService(401, true)));

    expect(answer).to.haveOwnProperty('error');
    expect(answer.error).to.be.deep.equal({response: {status: 401}});
  });

  it('should handle non-existing songkick username', async function () {
    const result =
      await runRouter(req, res.withServices(getApiService(404, true)));

    result.__stubs.checkAnswer(404, formatResponseError('SONGKICK_USER_NOT_FOUND'));
  });

  it('should return 0 on no artists tracked', async function () {
    const result =
      await runRouter(req, res.withServices(getApiService(NoTrackedArtistsExample)));

    result.__stubs.checkAnswer(200, {qty: 0});
  });

  it('should return qty of artists tracked', async function () {
    const result =
      await runRouter(req, res.withServices(getApiService(TrackedArtistsExample)));

    result.__stubs.checkAnswer(200, {qty: 3});
  });
});