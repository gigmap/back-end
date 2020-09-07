const ATTENDANCE = Object.freeze({
  GOING: 'im_going',
  INTERESTED: 'i_might_go'
});

const CONCERT_STATUS = Object.freeze({
  OK: 'ok',
  CANCELLED: 'cancelled',
  POSTPONED: 'postponed'
});

const EVENT_TYPE = Object.freeze({
  CONCERT: 'Concert',
  FESTIVAL: 'Festival'
});

module.exports = {
  ATTENDANCE,
  CONCERT_STATUS,
  EVENT_TYPE
};