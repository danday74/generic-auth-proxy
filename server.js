const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const router = express.Router();
const config = require('./server.config');
const ServerCreator = require('./js/ServerCreator');
const LETS_ENCRYPT_DOMAIN = process.env.LETS_ENCRYPT_DOMAIN;

let certDir = (LETS_ENCRYPT_DOMAIN) ? `/etc/letsencrypt/live/${LETS_ENCRYPT_DOMAIN}` : undefined;
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
  console.log(`HTTP server listening on port ${HTTP_PORT}`);
});

const HTTPS_PORT = config.httpsPort;
httpsServer && httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server listening on port ${HTTPS_PORT} with certs from ${certDir}`);
});

module.exports = httpServer;
