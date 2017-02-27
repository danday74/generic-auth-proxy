const validator = require('./validator');
const config = require(appRoot + '/authServer.config');

let route = router => {
  router.route('/logout')
    .post(validator, (req, res) => {

      res.cookie(config.jwt.cookieName, '', {
        maxAge: 0,
        httpOnly: true
      });

      return res.sendStatus(200);

    });
};

module.exports = route;
