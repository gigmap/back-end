const create = (result) => ({
  get: () => result
});

module.exports = Object.freeze({
  withNoResponse: () => create(Promise.reject({request: {}})),
  withError: (status) => create(Promise.reject({response: {status}})),
  withData: (data) => create(Promise.resolve({data}))
});