const RestSongkickApi = require('../../../../src/api/songkick/RestSongkickApi');

/**
 * @param {*} stub
 * @return {{getSongkickApi: (function(): RestSongkickApi)}}
 */
const useStubForApiServices = (stub) => ({
  getSongkickApi: () => new RestSongkickApi(stub)
});

module.exports = useStubForApiServices;