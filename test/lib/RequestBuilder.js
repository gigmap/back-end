const cloneDeep = require('lodash/cloneDeep');

class RequestBuilder {
  /**
   * @param {Object} data
   */
  constructor(data = {}) {

    /** @private */
    this.request = {
      method: 'GET',
      url: '/',
      body: {},
      headers: {},
      query: {},
      params: {},
      ...data
    };
  }

  /**
   * @param {Object} newProps
   * @return {RequestBuilder}
   * @private
   */
  _update(newProps) {
    return new RequestBuilder({
      ...cloneDeep(this.request),
      ...newProps
    });
  }

  /**
   * @param method
   * @param [url]
   * @return {RequestBuilder}
   * @private
   */
  _setTarget(method, url) {
    return this._update({
      method: method,
      url: url || this.request.url
    });
  }

  /**
   * @param {string} url
   * @return {RequestBuilder}
   */
  url(url) {
    return this._update({url});
  }

  /**
   * @param {string} [url]
   * @return {RequestBuilder}
   */
  get(url) {
    return this._setTarget('GET', url);
  }

  /**
   * @param {string} [url]
   * @return {RequestBuilder}
   */
  post(url) {
    return this._setTarget('POST', url);
  }

  /**
   * @param {string} [url]
   * @return {RequestBuilder}
   */
  patch(url) {
    return this._setTarget('PATCH', url);
  }

  /**
   * @param {string} [url]
   * @return {RequestBuilder}
   */
  delete(url) {
    return this._setTarget('DELETE', url);
  }

  /**
   * @param {Object} body
   * @return {RequestBuilder}
   */
  withBody(body) {
    return this._update({body});
  }

  /**
   * @param {Object} query
   * @return {RequestBuilder}
   */
  withQuery(query) {
    return this._update({query});
  }

  /**
   * @param {Object} headers
   * @return {RequestBuilder}
   */
  withHeaders(headers) {
    return this._update({headers});
  }

  /**
   * @param {Object} params
   * @return {RequestBuilder}
   */
  withParams(params) {
    return this._update({params});
  }

  /**
   * @return {Object}
   */
  build() {
    return cloneDeep(this.request);
  }

  /**
   * @return {RequestBuilder}
   */
  clone() {
    return new RequestBuilder(cloneDeep(this.request));
  }
}

module.exports = RequestBuilder;