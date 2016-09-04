const BibleHelper = require('../classes/BibleHelper');

class SearchResponseResult {

  constructor(version, verse, q) {

    let cleanVerseText = BibleHelper.cleanText(verse.verse_text);

    this.ref = '';
    this.refEnhanced = '';
    this.version = {
      ref: version.ref,
      name: version.name
    };
    this.book = {
      id: verse.book_id,
      name: verse.book_name
    };
    this.chapter = parseInt(verse.chapter_id);
    this.verse = parseInt(verse.verse_id);
    this.text = cleanVerseText;
    this.textEnhanced = BibleHelper.highlightText(cleanVerseText, q);

    // repeated so as to maintain property order
    this.ref = `${this.book.name} ${this.chapter}:${this.verse} ${this.version.ref}`;
    this.refEnhanced = `${this.book.name} ${this.chapter}:${this.verse} <abbr title="${this.version.name}">${this.version.ref}</abbr>`;

    Object.seal(this);
  }

}

module.exports = SearchResponseResult;
