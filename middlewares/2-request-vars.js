const middleware = (req, res, next) => {
  req.php = req.protocol + '://' + req.get('host').replace('127.0.0.1', 'localhost')
  return next()
}

module.exports = middleware
