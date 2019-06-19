const RestSongkickApi = require('../api/songkick/RestSongkickApi');
const createClient = require('../api/songkick/createClient');

/**
 * @implements IServiceFacade
 */
class ServiceFacade {
  constructor(config) {
    this.songkickApi = new RestSongkickApi(createClient(config.songkick));
  }

  /**
   * @return {SongkickApi}
   */
  getSongkickApi() {
    return this.songkickApi;
  }
}

module.exports = ServiceFacade;