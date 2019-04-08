const users = require('./users')
const validator = require('./validator')

const route = router => {
  router.route('/mock-validate-user')
    .post(validator, (req, res) => {

      const username = req.body.username
      const password = req.body.password
      const user = users.find(usr => {
        return usr.username.toLowerCase() === username.toLowerCase()
      })

      const authenticated = user != null && user.password === password

      if (authenticated) {
        const userclone = JSON.parse(JSON.stringify(user))
        delete userclone.password
        return res.status(200).json(userclone)
      } else {
        return res.sendStatus(401)
      }
    })
}

module.exports = route
