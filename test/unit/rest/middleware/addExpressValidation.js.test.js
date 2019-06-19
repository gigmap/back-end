const {expect} = require('chai');
const {describe, it} = require('mocha');
const expressValidationHandler =
  require('../../../../src/rest/middleware/expressValidationHandler');
const addExpressValidation =
  require('../../../../src/rest/middleware/addExpressValidation');

describe('handleExpressValidation', function () {

  it('should use single validator', async function () {
    const middlewareList = addExpressValidation(1);
    expect(middlewareList).to.be.deep.equal([1, expressValidationHandler]);
  });

  it('should use several validators', async function () {
    const middlewareList = addExpressValidation([1, 2]);
    expect(middlewareList).to.be.deep.equal([1, 2, expressValidationHandler]);
  });
});