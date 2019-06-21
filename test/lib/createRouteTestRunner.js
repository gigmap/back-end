const R = require('rambda');

/**
 * @param router
 * @param {RequestBuilder} req
 * @param {ResponseBuilder} res
 * @return {Promise<Object>}
 */
const runRoute = (router, req, res) => {

  req = req.build();
  res = res.build();

  return new Promise((resolve, reject) => {

    res.__stubs.completePromise.then(() => resolve(res), reject);

    // hacky-hacky
    router.handle(req, res, error => {

      if (!req.route) {
        return reject({error: 'No route found'});
      }

      if (error) {
        return resolve({error});
      }

      reject({error: 'Error expected'});
    });
  });
};

const curriedRunRoute = R.curry(runRoute);

/**
 * @param {number} router
 * @return {function(RequestBuilder, ResponseBuilder): Promise<Object>}
 */
const createRouteTestRunner = (router) => {
  // noinspection JSValidateTypes
  return curriedRunRoute(router);
};

module.exports = createRouteTestRunner;