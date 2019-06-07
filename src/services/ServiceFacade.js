const RestSongkickApi = require('../api/songkick/RestSongkickApi');

/**
 * @implements IServiceFacade
 */
class ServiceFacade {
  constructor(config) {
    this.songkickApi = new RestSongkickApi(config.songkick);
  }

  /**
   * @return {SongkickApi}
   */
  getSongkickApi() {
    return this.songkickApi;
  }
}

module.exports = ServiceFacade;