const validator = require('./validator')

const route = router => {
  router.route('/authenticated')
    .get(validator, (req, res) => {
      return res.sendStatus(200)
    })
}

module.exports = route
