const extractLocation = require('./extractLocation');
const stripDateFromName = require('./stripDateFromName');
const {
  ATTENDANCE, CONCERT_STATUS, EVENT_TYPE
} = require('../../../../../api/songkick/Constants');

/**
 * @param {Concert} concert
 * @param {string|undefined} attendance
 * @return {MappedConcert}
 */
const mapConcert = (concert, attendance) => {
  const {id, displayName, uri, start, status, type} = concert;
  /** @type {MappedConcert} */
  const result = {
    id,
    displayName: stripDateFromName(displayName),
    uri,
    location: extractLocation(concert),
    start: start.date,
    members: []
  };

  if (type === EVENT_TYPE.FESTIVAL) {
    result.isFestival = true;
  }

  if (status === CONCERT_STATUS.POSTPONED) {
    result.postponed = true;
  }

  if (attendance === ATTENDANCE.GOING) {
    result.going = true;
  } else if (attendance === ATTENDANCE.INTERESTED) {
    result.interested = true;
  }

  return result;
};

module.exports = mapConcert;