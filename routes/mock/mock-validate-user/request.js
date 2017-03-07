const users = require('./users');
const validator = require('./validator');

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
        let userclone = JSON.parse(JSON.stringify(user));
        delete userclone.password;
        return res.status(200).json(userclone);
      } else {
        return res.sendStatus(401);
      }
    });
};

module.exports = route;
