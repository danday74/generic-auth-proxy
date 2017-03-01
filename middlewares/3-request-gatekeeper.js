const jwt = require('jsonwebtoken');
const config = require('../authServer.config');

let middleware = (req, res, next) => {
  console.log(req.url);
  if (req.url === '/login') {
    return next();
  }
  if (req.url === '/mock-validate-user') {
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
