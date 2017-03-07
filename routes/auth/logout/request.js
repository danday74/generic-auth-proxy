const config = require(appRoot + '/authServer.config');
const validator = require('./validator');

let route = router => {
  router.route('/logout')
    .post(validator, (req, res) => {

      res.cookie(config.jwt.cookieName, '', {
        maxAge: 0,
        httpOnly: true,
        secure: req.secure
      });
      return res.sendStatus(200);
    });
};

module.exports = route;
