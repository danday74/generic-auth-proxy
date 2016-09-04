const VerseResponseResult = require('./VerseResponseResult');

class VerseResponse {

  constructor(verse) {
    this.type = 'verse';
    this.subType = undefined;
    this.ref = undefined;
    this.book = {
      id: verse.book_id,
      name: verse.book_name
    };
    this.chapter = parseInt(verse.chapter_id);
    this.verseStart = parseInt(verse.verse_id);
    this.verseEnd = undefined;
    this.results = [];
    Object.seal(this);
  }

  addResult(version, verseList) {
    let result = new VerseResponseResult(version);
    for (let verse of verseList) {
      this.verseEnd = parseInt(verse.verse_id);
      result.addVerse(verse, verseList.length > 1);
    }
    result.text = result.text.trim();
    result.textEnhanced = result.textEnhanced.trim();
    this.results.push(result);
  }

  setSubTypeAndRefs(type) {
    this.setSubType(type);
    this.setRef();
    this.setRefForResults();
  }

  setSubType(type) {
    if (type === 'verses' && this.verseStart === this.verseEnd) {
      this.subType = 'verse';
    } else {
      this.subType = type;
    }
  }

  setRef() {
    this.ref = `${this.book.name} ${this.chapter}`;
    if (this.subType === 'verse' || this.subType === 'verses') {
      this.ref += `:${this.verseStart}`;
      if (this.subType === 'verses') {
        this.ref += `-${this.verseEnd}`;
      }
    }
  }

  setRefForResults() {
    this.results.forEach((result) => {
      result.setRef(this.ref);
    });
  }
}

module.exports = VerseResponse;
