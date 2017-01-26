const config = require(appRoot + '/bibleServer.config');
const rp = require('request-promise');

class Requestor {

  static getRequestPromises(urlTemplate, versions) {

    let promises = [];

    for (let version of versions) {
      let url = urlTemplate({damId: version.damId});
      /* istanbul ignore next */
      config.logging && console.log(url);
      let promise = rp({
        url,
        timeout: config.timeout.upstream
      });
      promises.push(promise);
    }

    return promises;
  }
}

module.exports = Requestor;
