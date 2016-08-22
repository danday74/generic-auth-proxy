const _ = require('lodash');
const osisList = require('./osisList');

class Osis {

  constructor(q) {
    q = q.replace(/ /g, '');
    [3, 4, 5].forEach((i) => {
      let start = q.substring(0, i).toLowerCase();
      let temp = _.find(osisList, {start});
      if (temp) {
        this.object = temp;
      }
    });
  }

  static findIndex(matchesObject) {
    return _.findIndex(osisList, matchesObject);
  }

}

module.exports = Osis;
