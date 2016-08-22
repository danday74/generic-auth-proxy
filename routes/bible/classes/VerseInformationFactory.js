let VerseInformation = require('./VerseInformation');

class VerseInformationFactory {

  static getVerseInformation(q) {
    let re;
    let verseInformation;
    let reMain;
    let rePrefix = '^[\\w ]+ ';

    reMain = '\\d+$';
    re = new RegExp(rePrefix + reMain);

    if (re.test(q)) {
      let chapter = q.match(new RegExp(reMain))[0];
      verseInformation = new VerseInformation(chapter);
    }

    reMain = '\\d+:\\d+$';
    re = new RegExp(rePrefix + reMain);

    if (re.test(q)) {
      let cv = q.match(new RegExp(reMain))[0].split(':');
      verseInformation = new VerseInformation(cv[0], cv[1]);
    }

    reMain = '\\d+:\\d+-\\d+$';
    re = new RegExp(rePrefix + reMain);

    if (re.test(q)) {
      let cv = q.match(new RegExp(reMain))[0].split(':');
      let v = cv[1].split('-');
      verseInformation = new VerseInformation(cv[0], v[0], v[1]);
    }

    return verseInformation;
  }
}

module.exports = VerseInformationFactory;
