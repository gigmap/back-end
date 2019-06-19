const {describe, it} = require('mocha');
const sinon = require('sinon');
const handleError = require('../../../../src/rest/middleware/handleInternalError');
const ResponseBuilder = require('../../../lib/ResponseBuilder');
const formatError = require('../../../lib/formatResponseError');

describe('handleError', function () {

  const response = new ResponseBuilder();

  it('should return given endpoint error', function () {
    const handler = handleError(false);
    const res = response.build();

    handler({status: 400, body: {some: 'error'}}, {}, res);

    res.__stubs.checkAnswer(400, {some: 'error'});
  });

  it('should return shortened internal error for produdtion', function () {
    const handler = handleError(true);
    const res = response.build();

    handler(new Error('Oops'), {}, res);
    res.__stubs.checkAnswer(500, formatError('INTERNAL'));
  });

  it('should return full internal error for development', function () {
    const handler = handleError(false);
    const res = response.build();

    handler(new Error('Oops'), {}, res);
    res.__stubs.checkAnswer(500, formatError('INTERNAL', {
      message: 'Oops',
      stack: sinon.match.string
    }));
  });
});