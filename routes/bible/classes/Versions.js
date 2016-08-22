const _ = require('lodash');

const AVAILABLE_VERSIONS = [
  {
    name: 'English Standard Version',
    ref: 'ESV',
    damId: 'ENGESV'
  },
  {
    name: 'World English Bible',
    ref: 'WEB',
    damId: 'ENGWEB'
  },
  {
    name: 'New American Standard Bible',
    ref: 'NASB',
    damId: 'ENGNAS'
  },
  {
    name: 'King James Version',
    ref: 'KJV',
    damId: 'ENGKJV'
  }
];

class Versions {

  static getVersionsFromQuery(versions = '') {
    let results = [];
    versions = versions.replace(/ /g, '').split(',');
    for (let v of versions) {
      let version = _.find(AVAILABLE_VERSIONS, {ref: v.toUpperCase()});
      if (version) {
        results.push(version);
      }
    }
    if (!results.length) {
      results = AVAILABLE_VERSIONS;
    }
    return results;
  }

}

module.exports = Versions;
