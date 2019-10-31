const sinon = require('sinon');

const makeHandler = (result) => (url) => {
  if (result instanceof Map) {
    for (const [key, value] of Array.from(result.entries())) {
      if (key === url) {
        return Promise.resolve({data: value});
      }
    }

    throw new Error('AxiosStub endpoint not found');
  }

  return result;
};

/**
 * @param {*|Map<string, *>} result
 * @return {Object}
 */
const create = (result) => ({
  get: makeHandler(result),
  post: makeHandler(result)
});

const createStubbed = (data) => {
  return {
    get: sinon.stub().resolves({data}),
    post: sinon.stub().resolves({data})
  };
};

// noinspection JSValidateTypes
module.exports = Object.freeze({
  /**
   * @return {AxiosInstance}
   */
  withNoResponse: () => create(Promise.reject({request: {}})),

  /**
   * @param {number|Map<String, number>} status
   * @return {AxiosInstance}
   */
  withError: (status) => create(Promise.reject({response: {status}})),

  /**
   * @param {Object|Map<String, Object>} data
   * @return {AxiosInstance}
   */
  withData: (data) => create(
    data instanceof Map ? data : Promise.resolve({data})),

  /**
   * @param {Object} data
   * @return {AxiosInstance}
   */
  withStubs: (data) => createStubbed(data)
});