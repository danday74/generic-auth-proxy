const jwt = require('jsonwebtoken');
const config = require(appRoot + '/authServer.config');
const validator = require('./validator');

let route = router => {
  router.route('/whoami')
    .get(validator, (req, res) => {

      // no need to handle errors since we know this token is valid
      let token = req.cookies[config.jwt.cookieName];
      jwt.verify(token, config.jwt.secret, (err, decoded) => {

        const properties = ['username', 'email'];

        const restrictedUser = Object.keys(decoded)
          .filter(key => properties.includes(key))
          .reduce((obj, key) => {
            obj[key] = decoded[key];
            return obj;
          }, {});

        return res.status(200).json(restrictedUser);
      });
    });
};

module.exports = route;
