const {errors: {invalidTimeInterval, timeIntervalTooLong}} = require('../Constants');

const DIVIDER = 1000 * 60 * 60 * 24; // day is ms

/**
 * @param {string} from
 * @param {string} to
 * @param {number} maxDays
 * @return {{valid: boolean, [error]: string}}
 */
const checkTimeInterval = (from, to, maxDays) => {
  if (!from && !to) {
    return {valid: true}; // no checks required
  }

  const fromTimestamp = new Date(from).getTime();
  const toTimestamp = new Date(to).getTime();
  if (fromTimestamp > toTimestamp) {
    return {valid: false, error: invalidTimeInterval};
  }

  if (maxDays < 0) {
    return {valid: true};
  }

  const diff = toTimestamp - fromTimestamp;
  const daysDiff = diff / DIVIDER;

  if (daysDiff > maxDays) {
    return {valid: false, error: timeIntervalTooLong};
  }

  return {valid: true};
};

module.exports = checkTimeInterval;