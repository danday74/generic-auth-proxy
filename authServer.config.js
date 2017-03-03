let testRun = process.env.NODE_ENV === 'test';

let config = {
  logging: !testRun,
  certDir: '/etc/ssl/letsencrypt',
  httpPort: (testRun) ? 41108 : /* istanbul ignore next */ 51108,
  httpsPort: (testRun) ? 41109 : /* istanbul ignore next */ 51109,

  mockValidateUserEnabled: false,
  proxy: process.env.HTTP_PROXY || /* istanbul ignore next */ process.env.http_proxy
  || /* istanbul ignore next */ process.env.HTTPS_PROXY || /* istanbul ignore next */ process.env.https_proxy,
  timeout: {
    upstream: 9000
  },
  jwt: {
    secret: 'FLEDFRINTSTONE',
    expiresIn: 86400, // 24 hours
    cookieName: 'twj'
  },
  upstream: 'http://localhost:2020',
  nockHost: 'localhost'
};

module.exports = config;
