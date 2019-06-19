const {describe, it} = require('mocha');
const handleNotFound = require('../../../../src/rest/middleware/handleNotFound');
const ResponseBuilder = require('../../../lib/ResponseBuilder');
const formatError = require('../../../lib/formatResponseError');

describe('handleNotFound', function () {

  const response = new ResponseBuilder();

  it('should return error with 404 status', function () {
    const handler = handleNotFound();
    const res = response.build();

    handler({}, res);

    res.__stubs.checkAnswer(404, formatError('ENDPOINT_NOT_FOUND'));
  });
});