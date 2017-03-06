const validator = require('./validator');
const config = require(appRoot + '/authServer.config');
const jwt = require('jsonwebtoken');

let route = router => {
  router.route('/whoami')
    .get(validator, (req, res) => {

      let token = req.cookies[config.jwt.cookieName];
      jwt.verify(token, config.jwt.secret, (err, decoded) => {
        let restrictedUser = {
          username: decoded.username,
          email: decoded.email
        };
        return res.status(200).json(restrictedUser);
      });
    });
};

module.exports = route;
