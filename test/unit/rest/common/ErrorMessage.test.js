const {expect} = require('chai');
const {describe, it} = require('mocha');
const ErrorMessage = require('../../../../src/rest/common/ErrorMessage');

const CODE = 'some-code';
const DATA = {num: 1, str: '2'};

describe('ErrorMessage', function () {

  it('should build empty errors by default', function () {
    const errors = new ErrorMessage().build();
    expect(errors).to.be.deep.equal({errors: []});
  });

  describe('messages without data', () => {
    const check = error =>
      expect(error).to.be.deep.equal({errors: [{code: CODE}]});

    it('should use code from constructor', function () {
      check(new ErrorMessage(CODE).build());
    });

    it('should use code from static method', function () {
      check(ErrorMessage.prebuilt(CODE));
    });

    it('should use code from add method', function () {
      check(new ErrorMessage().add(CODE).build());
    });
  });

  describe('messages with data', () => {
    const check = error =>
      expect(error).to.be.deep.equal({errors: [{code: CODE, ...DATA}]});

    it('should use data from constructor', function () {
      check(new ErrorMessage(CODE, {...DATA}).build());
    });

    it('should use data from static method', function () {
      check(ErrorMessage.prebuilt(CODE, DATA));
    });

    it('should use data from add method', function () {
      check(new ErrorMessage().add(CODE, DATA).build());
    });
  });
});