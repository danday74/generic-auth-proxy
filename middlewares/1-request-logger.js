const config = require('../authServer.config')
const Logger = require('../js/Logger')

const middleware = (req, res, next) => {

  /* istanbul ignore next */
  config.logging && console.log(Logger.getTimestamp(), req.protocol.toUpperCase(), req.method, req.url)
  return next()
}

module.exports = middleware
