const RestSongkickApi = require('../../../../src/api/songkick/RestSongkickApi');
const ClientStub = require('./AxiosStub');

/**
 * @param {*} data
 * @param {boolean} [error=false]
 * @return {{getSongkickApi: (function(): RestSongkickApi)}}
 */
const getApiService = (data, error = false) => ({
  getSongkickApi: () => new RestSongkickApi(
    error ?
      ClientStub.withError(data) :
      ClientStub.withData(data))
});

module.exports = getApiService;