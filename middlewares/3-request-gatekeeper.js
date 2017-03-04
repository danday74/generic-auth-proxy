const jwt = require('jsonwebtoken');
const config = require('../authServer.config');

let middleware = (req, res, next) => {
  if (req.url === '/login' && req.method === 'POST') {
    return next();
  }
  /* istanbul ignore next */
  if (req.url === '/mock-validate-user' && req.method === 'POST') {
    return next();
  }
  let token = req.cookies[config.jwt.cookieName];
  if (!token) {
    return res.sendStatus(401);
  }

  // noinspection Eslint, JSUnusedLocalSymbols
  jwt.verify(token, config.jwt.secret, function (err, decoded) {
    if (err) {
      return res.sendStatus(401);
    } else {
      // console.log(decoded);
      return next();
    }
  });
};

module.exports = middleware;
