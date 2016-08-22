class VerseResponse {
  constructor(verse) {
    let verseStart = verse.verse_id;

    this.type = 'verse';
    this.subType = undefined;
    this.ref = undefined;
    this.book = {
      id: verse.book_id,
      name: verse.book_name
    };
    this.chapter = parseInt(verse.chapter_id);
    this.verseStart = parseInt(verseStart);
    this.verseEnd = parseInt(verseStart);
    this.results = [];
    Object.seal(this);
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
      result.ref = `${this.ref} ${result.version.ref}`;
      result.refEnhanced = `${this.ref} <abbr title="${result.version.name}">${result.version.ref}</abbr>`;
    });
  }

}

module.exports = VerseResponse;
