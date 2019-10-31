const {uniqBy, unescape} = require('lodash');
const createLogger = require('../../../../../helpers/createLogger');

const logger = createLogger('getBandsFromHtml');

/**
 * @param {string} html
 * @return {{id: string, title: string}[]}
 */
const getBandsFromHtml = (html) => {
  if (!html) {
    return [];
  }

  const pattern = /data-matched-id="([^"]+)".+?aria-label="Artist: ([^"]+)"/ig;
  let found = pattern.exec(html);
  const result = [];
  while (found !== null) {
    result.push({
      id: found[1],
      title: unescape(found[2])
    });
    found = pattern.exec(html);
  }

  logger.debug(`Found rows: ${result.length}`);
  return uniqBy(result, 'id');
};

module.exports = {getBandsFromHtml};