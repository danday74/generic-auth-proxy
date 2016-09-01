let config = {
  logging: !(process.env.NODE_ENV === 'test'),
  httpPort: 52922,
  httpsPort: 52923,
  providers: {
    digitalBibleToolkit: {
      endpoint: 'http://dbt.io/text',
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
  url: config.proxy || 'http://dbt.io',
  pre: (config.proxy) ? 'http://dbt.io' : '' // path prefix
};

module.exports = config;
