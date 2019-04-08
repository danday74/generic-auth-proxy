require('./test/server.bootstrap')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const router = express.Router()
const globby = require('globby')
const proxy = require('express-http-proxy')
const config = require('./authServer.config')
const Logger = require('./js/Logger')
const ServerCreator = require('./js/ServerCreator')

const serverCreator = new ServerCreator(app)
const httpServer = serverCreator.createHttpServer()
// let httpsServer = serverCreator.createHttpsServer(config.certDir)

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use(require('./middlewares/1-request-logger'))
app.use(require('./middlewares/2-request-vars'))
app.use(require('./middlewares/3-request-gatekeeper'))

globby([`${appRoot}/routes/auth/**/request.js`]).then(paths => {
  paths.forEach(path => {
    require(path)(router)
  })
})

/* istanbul ignore next */
if (config.mockValidateUserEnabled) {
  require(`${appRoot}/routes/mock/mock-validate-user/request.js`)(router)
}

app.use('/', router)
app.use('/', proxy(config.upstream, {
  timeout: config.timeout.upstream
}))

const HTTP_PORT = config.httpPort
httpServer.listen(HTTP_PORT, () => {
  /* istanbul ignore next */
  config.logging && console.log(`${Logger.getTimestamp()} ==================== HTTP server listening on port ${HTTP_PORT}`)
})

// const HTTPS_PORT = config.httpsPort
// httpsServer && httpsServer.listen(HTTPS_PORT, () => {
//   /* istanbul ignore next */
//   config.logging && console.log(`${Logger.getTimestamp()} ==================== HTTPS server listening on port ${HTTPS_PORT} with certs from ${config.certDir}`)
// })

module.exports = {
  http: httpServer
  // https: httpsServer
}
