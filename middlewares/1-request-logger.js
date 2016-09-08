const config = require('../server.config');

let middleware = (req, res, next) => {
  /* istanbul ignore next */
  config.logging && console.log(req.protocol.toUpperCase(), req.method, req.url);
  return next();
};

module.exports = middleware;
