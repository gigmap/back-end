/**
 * @param {UserCalendarEntry[]} userEvents
 * @return {Object<string, string>}
 */
const makeAttendanceMap = (userEvents) => {
  return userEvents.reduce((acc, it) => {
    acc[it.event.id] = it.reason.attendance;
    return acc;
  }, {});
};

module.exports = {makeAttendanceMap};