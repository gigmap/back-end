const axios = require('axios');

/**
 * @param {SongkickConfig} config
 * @return {AxiosInstance}
 */
const createClient = (config) => {
  const client = axios.create({
    baseURL: config.baseUrl,
    responseType: 'json'
  });

  const DEFAULT_REQ_PARAMS = Object.freeze({
    apikey: config.apiKey,
    per_page: 'all'
  });

  client.interceptors.request.use(requestConfig => {
    requestConfig.params = requestConfig.params ?
      {...DEFAULT_REQ_PARAMS, ...requestConfig.params} :
      {...DEFAULT_REQ_PARAMS};

    return requestConfig;
  });

  return client;
};

module.exports = createClient;