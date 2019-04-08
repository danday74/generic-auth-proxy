const testRun = process.env.NODE_ENV === 'test'

const config = {
  logging: !testRun,
  // certDir: '/etc/ssl/letsencrypt',
  httpPort: (testRun) ? 41108 : /* istanbul ignore next */ 51108,
  // httpsPort: (testRun) ? 41109 : /* istanbul ignore next */ 51109,
  jwt: {
    cookieName: 'twj',
    expiresIn: 86400, // 24 hours
    secret: 'FLEDFRINTSTONE'
  },
  mockValidateUserEnabled: true,
  nockHost: 'localhost',
  timeout: {
    upstream: 9000
  },
  upstream: 'http://localhost:2020'
}

module.exports = config
