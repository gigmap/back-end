const sinon = require('sinon');
const cloneDeep = require('lodash/cloneDeep');

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
   * @param locals
   * @return {ResponseBuilder}
   */
  withLocals(locals) {
    this.data.locals = {...this.data.locals, ...locals};
    return this;
  }

  /**
   * @param config
   * @return {ResponseBuilder}
   */
  withConfig(config) {
    this.data.app.locals.config = {
      ...this.data.app.locals.config,
      ...config
    };
    return this;
  }

  build(services) {
    const json = sinon.spy();
    const status = sinon.stub().returns({json, send: Function()});

    const result = {
      ...cloneDeep(this.data),
      status,
      __stubs: {
        json, status,
        checkAnswer: (expectedStatus, body) =>
          checkAnswer(status, json, expectedStatus, body)
      }
    };

    if (services) {
      result.app.locals.services = services;
    }

    return result;
  }

  /**
   * @return {ResponseBuilder}
   */
  clone() {
    return new ResponseBuilder(cloneDeep(this.data));
  }
}

module.exports = ResponseBuilder;