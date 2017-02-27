let testRun = process.env.NODE_ENV === 'test';

let config = {
  logging: !testRun,
  certDir: '/etc/ssl/letsencrypt',
  httpPort: (testRun) ? 41108 : /* istanbul ignore next */ 51108,
  httpsPort: (testRun) ? 41109 : /* istanbul ignore next */ 51109,
  providers: {
    digitalBibleToolkit: {
      endpoint: 'http://dbt.io',
      key: '0d1bd6c2bff512d1e68a37bb224c8247'
    }
  },
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
  upstream: 'http://localhost:2020'
};

/* istanbul ignore next */
config.nock = {
  url: config.proxy || config.providers.digitalBibleToolkit.endpoint,
  pre: (config.proxy) ? config.providers.digitalBibleToolkit.endpoint : '' // path prefix
};

module.exports = config;
