const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = express.Router();
const config = require('./bibleServer.config');
const Logger = require('./js/Logger');
const ServerCreator = require('./js/ServerCreator');
const LETS_ENCRYPT_DOMAIN = process.env.LETS_ENCRYPT_DOMAIN;

let certDir = (LETS_ENCRYPT_DOMAIN) ? `/etc/letsencrypt/live/${LETS_ENCRYPT_DOMAIN}` : /* istanbul ignore next */ undefined;
let serverCreator = new ServerCreator(app);
let httpServer = serverCreator.createHttpServer();
let httpsServer = serverCreator.createHttpsServer(certDir);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('./middlewares/1-request-logger'));

require('./routes/bible/bible')(router);

app.use('/', router);

const HTTP_PORT = config.httpPort;
httpServer.listen(HTTP_PORT, () => {
  /* istanbul ignore next */
  config.logging && console.log(`${Logger.getTimestamp()} ==================== HTTP server listening on port ${HTTP_PORT}`);
});

const HTTPS_PORT = config.httpsPort;
httpsServer && httpsServer.listen(HTTPS_PORT, () => {
  /* istanbul ignore next */
  config.logging && console.log(`${Logger.getTimestamp()} ==================== HTTPS server listening on port ${HTTPS_PORT} with certs from ${certDir}`);
});

module.exports = httpServer;