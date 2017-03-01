const validator = require('./validator');
const users = require('./users');

let route = router => {
  router.route('/mock-validate-user')
    .post(validator, (req, res) => {

      let username = req.body.username;
      let password = req.body.password;
      let user = users.find((usr) => {
        return usr.username.toLowerCase() === username.toLowerCase();
      });

      let authenticated = user != null && user.password === password;

      if (authenticated) {
        return res.status(200).send(user);
      } else {
        return res.sendStatus(401);
      }
    });
};

module.exports = route;
