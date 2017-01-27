const domain = require('os').hostname().split('.').pop() + '.com';
let testRun = process.env.NODE_ENV === 'test';

let config = {
  logging: !testRun,
  domain,
  httpPort: (testRun) ? 42922 : /* istanbul ignore next */ 52922,
  httpsPort: (testRun) ? 42923 : /* istanbul ignore next */ 52923,
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
  }
};

/* istanbul ignore next */
config.nock = {
  url: config.proxy || config.providers.digitalBibleToolkit.endpoint,
  pre: (config.proxy) ? config.providers.digitalBibleToolkit.endpoint : '' // path prefix
};

module.exports = config;
