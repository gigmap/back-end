const {expect} = require('chai');
const {describe, it} = require('mocha');
const sinon = require('sinon');
const {body} = require('express-validator');
const expressValidationHandler = require('../../../../src/rest/middleware/expressValidationHandler');
const ResponseBuilder = require('../../../lib/ResponseBuilder');

describe('handleExpressValidation', function () {

  const response = new ResponseBuilder();

  it('should call next without error on valid body', async function () {
    const req = {body: {test: 'xxx', extra: 'field'}};
    const res = response.build();

    const chain = body('test').isString();
    await new Promise(resolve => chain(req, res, resolve));

    const next = sinon.spy();
    expressValidationHandler(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWithExactly(next);
    expect(res.locals.input).to.be.deep.equal({test: 'xxx'});
  });

  it('should raise error on invalid body', async function () {
    const req = {body: {test: 123, extra: 'field'}};
    const res = response.build();

    const chain = body('test').isString();
    await new Promise(resolve => chain(req, res, resolve));

    const next = sinon.spy();
    expressValidationHandler(req, res, next);

    sinon.assert.calledOnce(next);
    sinon.assert.calledWithExactly(next, sinon.match({status: 400}));
  });
});