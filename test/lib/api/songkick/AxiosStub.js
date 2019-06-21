/**
 * @param {*|Map<string, *>} result
 * @return {Object}
 */
const create = (result) => ({
  get: (url) => {
    if (result instanceof Map) {
      for (const [key, value] of Array.from(result.entries())) {
        if (key === url) {
          return Promise.resolve({data: value});
        }
      }

      throw new Error('AxiosStub endpoint not found');
    }

    return result;
  }
});

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
    data instanceof Map ? data : Promise.resolve({data}))
});