const axios = require('axios');
const logger = require('../../helpers/createLogger')('RestSongkickApi');

/**
 * @implements SongkickApi
 */
class RestSongkickApi {

  /**
   * @param {SongkickConfig} config
   */
  constructor(config) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      responseType: 'json'
    });

    const defaultRequestParams = {
      apikey: config.apiKey,
      per_page: 'all'
    };

    this.client.interceptors.request.use(config => {
      config.params = config.params ?
        {...defaultRequestParams, ...config.params} :
        {...defaultRequestParams};

      return config;
    });
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

  async countArtists(username) {
    const data = await this._requestArtists(username, {
      params: {
        fields: 'id',
        per_page: 1
      }
    });

    return data ? data.totalEntries : null;
  }

  async listArtists(username) {
    const data = await this._requestArtists(username, {
      params: {
        fields: 'id,displayName'
      }
    });

    return data ? data.results.artist : null;
  }

  async listConcerts(artistsId, from, to) {
    const data = await this._requestConcerts(artistsId);
    if (data.totalEntries === 0) {
      return [];
    }

    return  data.results.event;
  }
}

module.exports = RestSongkickApi;