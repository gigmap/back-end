const {pick} = require('lodash');
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
   * @param username
   * @param {Object} [config]
   * @return {Promise<Object>}
   * @private
   */
  _requestTrackedArtists(username, config = {}) {
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
    const data = await this._requestTrackedArtists(username, {
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
    const data = await this._requestTrackedArtists(username, {
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
   * @param {string} [from]
   * @param {string} [to]
   * @return {Promise<Concert[]>}
   */
  async listConcerts(artistsId, from, to) {
    const config = {};
    if (from && to) {
      config.params = {
        min_date: from,
        max_date: to
      };
    }

    const data = await this._requestConcerts(artistsId, config);
    if (data.totalEntries === 0) {
      return [];
    }

    return data.results.event;
  }

  /**
   * @param {string} name
   * @return {Promise<Artist>}
   */
  async findArtist(name) {
    const response = await this.client.get('/search/artists.json', {
      params: {
        query: name,
        per_page: 1
      }
    });

    const {totalEntries, results: {artist: artists}} = response.data.resultsPage;
    if (totalEntries === 0) {
      return null;
    }

    return pick(artists[0], 'id', 'displayName', 'uri');
  }

  /**
   * @param {string} username
   * @return {Promise<UserCalendarEntry[]>}
   */
  async getUserAttendance(username) {
    const response = await this.client
      .get(`/users/${username}/calendar.json?reason=attendance`)
      .catch((error) => {
        logger.error('User attendance request error: %s', error.response.status);
        return {data: {resultsPage: {status: 'error'}}};
      });

    const {totalEntries, status, results} = response.data.resultsPage;
    // TODO: check status in every other method
    if (totalEntries === 0 || status !== 'ok') {
      return [];
    }

    return results.calendarEntry;
  }
}

module.exports = RestSongkickApi;