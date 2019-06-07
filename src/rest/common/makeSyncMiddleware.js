const makeSyncMiddleware = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (e) {
    next(e);
  }
};

module.exports = makeSyncMiddleware;