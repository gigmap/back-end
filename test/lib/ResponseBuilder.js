const sinon = require('sinon');
const cloneDeep = require('lodash/cloneDeep');
const defaultsDeep = require('lodash/defaultsDeep');

const checkAnswer = (status, json, expectedStatus, expectedBody) => {
  sinon.assert.calledOnce(status);
  sinon.assert.calledWithExactly(status, expectedStatus);
  if (expectedBody !== undefined) {
    sinon.assert.calledOnce(json);
    sinon.assert.calledWithExactly(json, expectedBody);
  }
};

class ResponseBuilder {
  constructor(data) {
    this.data = data || {
      locals: {},
      app: {
        locals: {
          config: {},
          services: {}
        }
      }
    };
  }

  /**
   * @param {Object} newProps
   * @return {ResponseBuilder}
   * @private
   */
  _update(newProps) {
    return new ResponseBuilder(
      defaultsDeep({}, newProps, cloneDeep(this.data)));
  }

  /**
   * @param locals
   * @return {ResponseBuilder}
   */
  withLocals(locals) {
    return this._update({locals});
  }

  /**
   * @param config
   * @return {ResponseBuilder}
   */
  withConfig(config) {
    return this._update({app: {locals: {config}}});
  }

  /**
   * @param services
   * @return {ResponseBuilder}
   */
  withServices(services) {
    return this._update({app: {locals: {services}}});
  }

  /**
   * @return {Object}
   */
  build() {
    let complete;
    const completePromise = new Promise(resolve => complete = resolve);

    const json = sinon.spy();
    const status = sinon.stub().returns({
      json: (...args) => {
        complete();
        json(...args);
      }
    });

    return {
      ...cloneDeep(this.data),
      status,
      __stubs: {
        completePromise,
        checkAnswer: (expectedStatus, body) =>
          checkAnswer(status, json, expectedStatus, body)
      }
    };
  }

  /**
   * @return {ResponseBuilder}
   */
  clone() {
    return new ResponseBuilder(cloneDeep(this.data));
  }
}

module.exports = ResponseBuilder;