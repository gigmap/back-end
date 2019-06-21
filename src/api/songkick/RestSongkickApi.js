const logger = require('../../helpers/createLogger')('RestSongkickApi');

/**
 * @implements SongkickApi
 */
class RestSongkickApi {

  /**
   * @param {AxiosInstance} client
   */
  constructor(client) {
    /** @private */ this.client = client;
  }

  /**
   *
   * @param username
   * @param {Object} [config]
   * @return {Promise<Object>}
   * @private
   */
  _requestArtists(username, config = {}) {
    return this.client.get(`/users/${username}/artists/tracked.json`, config)
      .then((result) => {
        return result.data.resultsPage;
      }).catch(error => {
        if (error.response) {
          logger.debug('Artist request error: %s', error.response.status);
          if (error.response.status === 404) {
            return null;
          }

          throw error;
        }

        throw error;
      });
  }

  /**
   *
   * @param artistId
   * @param config
   * @return {Promise<Object>}
   * @private
   */
  _requestConcerts(artistId, config = {}) {
    return this.client.get(`/artists/${artistId}/calendar.json`, config)
      .then((result) => {
        return result.data.resultsPage;
      });
  }

  /**
   * @param {string} username
   * @return {Promise<number | null>}
   */
  async countArtists(username) {
    const data = await this._requestArtists(username, {
      params: {
        fields: 'id',
        per_page: 1
      }
    });

    return data ? data.totalEntries : null;
  }

  /**
   * @param {string} username
   * @return {Promise<Artist[] | null>}
   */
  async listArtists(username) {
    const data = await this._requestArtists(username, {
      params: {
        fields: 'id,displayName'
      }
    });

    // user not found
    if (!data) {
      return null;
    }

    const {totalEntries, results} = data;
    return totalEntries === 0 ? [] : results.artist;
  }

  /**
   * @param {number} artistsId
   * @param [from]
   * @param [to]
   * @return {Promise<Concert[]>}
   */
  async listConcerts(artistsId, from, to) {
    const data = await this._requestConcerts(artistsId);
    if (data.totalEntries === 0) {
      return [];
    }

    return data.results.event;
  }
}

module.exports = RestSongkickApi;