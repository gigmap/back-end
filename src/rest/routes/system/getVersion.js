const makeSyncMiddleware = require('../../common/makeSyncMiddleware');
const {version} = require('../../../../package');

const getVersion = () => makeSyncMiddleware((req, res) => {
  res.status(200).json({version});
});

module.exports = getVersion;