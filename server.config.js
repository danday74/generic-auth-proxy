let config = {
  logging: !(process.env.NODE_ENV === 'test'),
  port: 52922,
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

module.exports = config;
