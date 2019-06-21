const {describe, it} = require('mocha');
const {
  ResponseBuilder,
  RequestBuilder,
  createRouteTestRunner
} = require('../../../../lib');
const router = require('../../../../../src/rest/routes/system/router');
const {version} = require('../../../../../package');

describe('getVersion', function () {

  /** @type {(function(RequestBuilder, ResponseBuilder): Promise<Object>)} */
  const runRouter = createRouteTestRunner(router);
  const req = new RequestBuilder().get('/version');
  const res = new ResponseBuilder();

  it('should return package version', async function () {
    const result = await runRouter(req, res);
    result.__stubs.checkAnswer(200, {version});
  });
});