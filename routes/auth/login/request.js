const validator = require('./validator');
const jwt = require('jsonwebtoken');
const users = require('./users');
const config = require(appRoot + '/authServer.config');

let route = router => {
  router.route('/login')
    .post(validator, (req, res) => {

      let username = req.body.username;
      let password = req.body.password;
      let user = users.find((usr) => {
        return usr.username.toLowerCase() === username.toLowerCase();
      });

      let authenticated = user != null && user.password === password;
      let responseCode = (authenticated) ? 200 : 401;

      if (authenticated) {
        let token = jwt.sign(user, config.jwt.secret, {
          expiresIn: config.jwt.expiresIn
        });
        res.cookie(config.jwt.cookieName, token, {
          maxAge: config.jwt.expiresIn,
          httpOnly: true
        });
      }

      return res.sendStatus(responseCode);

    });
};

module.exports = route;
