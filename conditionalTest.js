const appRoot = require('app-root-path')
const child = require('child_process')
const config = require('./authServer.config')

let cmd = appRoot + '/node_modules/.bin/istanbul cover -x "**/*.spec.js" ./node_modules/mocha/bin/_mocha -- js routes/auth'

if (config.mockValidateUserEnabled) {
  cmd += ' routes/mock'
}

const handle = child.exec(cmd)
handle.stdout.pipe(process.stdout)
