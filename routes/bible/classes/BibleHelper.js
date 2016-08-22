let _ = require('lodash');
let Osis = require('./Osis');

class BibleHelper {

  static cleanText(verseText) {
    verseText = verseText.replace(' \n\t\t\t', '');
    return verseText.trim();
  }

  static highlightText(text, q) {
    let qs = q.split('|');
    for (let query of qs) {
      query = query.trim();
      text = text.replace(new RegExp(`(${query})`, 'gi'), '<em>$1</em>');
    }
    return text;
  }

  static sortVersesInBiblicalOrder(verses, versions) {

    verses.sort((verse1, verse2) => {
      let result;
      let book1Index = Osis.findIndex({id: verse1.book.id});
      let book2Index = Osis.findIndex({id: verse2.book.id});
      if (book1Index === book2Index) {
        if (verse1.chapter === verse2.chapter) {
          if (verse1.verse === verse2.verse) {
            let version1Index = _.findIndex(versions, {ref: verse1.version.ref});
            let version2Index = _.findIndex(versions, {ref: verse2.version.ref});
            result = version1Index > version2Index;
          } else {
            result = verse1.verse > verse2.verse;
          }
        } else {
          result = verse1.chapter > verse2.chapter;
        }
      } else {
        result = book1Index > book2Index;
      }
      return (result) ? 1 : -1;
    });

  }

}

module.exports = BibleHelper;
