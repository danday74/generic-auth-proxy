const fs = require('fs');
const http = require('http');
const https = require('https');

class ServerCreator {

  constructor(app) {
    this.app = app;
  }

  createHttpServer() {
    return http.createServer(this.app);
  }

  createHttpsServer(certDir) {

    if (!certDir) {
      return undefined;
    }

    try {
      let options = {
        key: fs.readFileSync(`${certDir}/privkey.pem`),
        cert: fs.readFileSync(`${certDir}/fullchain.pem`),
        ca: fs.readFileSync(`${certDir}/chain.pem`)
      };
      return https.createServer(options, this.app);
    } catch (err) {
      /* istanbul ignore else */
      if (err.code === 'ENOENT') {
        return undefined;
      } else {
        throw err;
      }
    }
  }
}

module.exports = ServerCreator;