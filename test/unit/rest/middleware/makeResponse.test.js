const {expect} = require('chai');
const {describe, it} = require('mocha');
const ErrorMessage = require('../../../../src/rest/common/ErrorMessage');
const makeResponse = require('../../../../src/rest/middleware/makeResponse');
const formatError = require('../../../lib/formatResponseError');

describe('makeResponse', function () {

  it('should make response with string message', function () {
    const response = makeResponse(200, 'CODE');
    expect(response).to.be.deep.equal({status: 200, body: formatError('CODE')});
  });

  it('should make response with ErrorMessage', function () {
    const response = makeResponse(200, new ErrorMessage().add('CODE'));
    expect(response).to.be.deep.equal({status: 200, body: formatError('CODE')});
  });
});
