const jwt = require('jsonwebtoken');
const config = require('../authServer.config');

let middleware = (req, res, next) => {
  if (req.url === '/login' && req.method === 'POST') {
    return next();
  }
  if (req.url === '/mock-validate-user' && req.method === 'POST') {
    return next();
  }
  let token = req.cookies[config.jwt.cookieName];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, config.jwt.secret, function (err) {
    if (err) {
      return res.sendStatus(401);
    } else {
      return next();
    }
  });
};

module.exports = middleware;
