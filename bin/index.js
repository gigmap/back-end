const http = require('http');
const normalizePort = require('normalize-port');
const createApp = require('../src/createApp');
const createLogger = require('../src/helpers/createLogger');

const DEFAULT_PORT = 4000;

const logger = createLogger('bin/index.js');

const onUnhandledError = (e) => {
  logger.error(e);
  process.exit(1);
};

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

const app = createApp();

app.locals.readyPromise.then(() => {

  process.on('SIGINT', () => {
    logger.debug('Got a sigint');
    // release all resources
    app.locals.prepareToShutdown()
      .then(() => process.exit(0))
      .catch(e => {
        logger.error(e);
        process.exit(1);
      });
  });

  const rawPort = process.env.PORT || DEFAULT_PORT;
  const port = normalizePort(rawPort);
  if (!port) {
    logger.error(`${rawPort} is not a correct port value`);
    process.exit(1);
  }

  app.set('port', port);

  const server = http.createServer(app);
  server.listen(port);
  server.on('error', function (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(port + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(port + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', function () {
    const addr = server.address();
    // todo: named pipes (?)
    logger.info(`Listening on ${addr.port}`);
  });
});