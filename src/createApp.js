const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rootRoute = require('./router');
const EnvHelper = require('./helpers/EnvHelper');
const ServiceFacade = require('./services/ServiceFacade');
const handleNotFound = require('./rest/middleware/handleNotFound');
const handleInternalError = require('./rest/middleware/handleInternalError');
const createConfig = require('./createConfig');
const logger = require('./helpers/createLogger')('app');
const expressPino = require('express-pino-logger')({
  logger
});

function createApp() {
  const app = express();

  app.locals.config = createConfig(EnvHelper.isProduction);
  app.locals.services = new ServiceFacade(app.locals.config);

  app.locals.readyPromise = Promise.resolve();
  app.locals.prepareToShutdown = () => Promise.resolve();

  // app config
  app.disable('x-powered-by');

  // app middleware
  app.use(helmet());
  app.use(cors(EnvHelper.isProduction ? {
    origin: app.locals.config.gigmap.frontendOrigin
  } : {}));

  if (EnvHelper.isDevelopment) {
    app.use(expressPino);
  }

  // app routes
  app.use('/api/v1', rootRoute);

  // catch 404 and forward to error handler
  app.use(handleNotFound());
  app.use(handleInternalError(EnvHelper.isProduction));

  return app;
}


module.exports = createApp;