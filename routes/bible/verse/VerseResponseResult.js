const BibleHelper = require('../classes/BibleHelper');

class VerseResponseResult {

  constructor(version) {
    this.ref = undefined;
    this.refEnhanced = undefined;
    this.version = {
      ref: version.ref,
      name: version.name
    };
    this.text = '';
    this.textEnhanced = '';
    this.texts = [];
    Object.seal(this);
  }

  addVerse(verse, withSup) {
    let cleanVerseText = BibleHelper.cleanText(verse.verse_text);
    this.text += `${cleanVerseText} `;
    if (withSup) {
      this.textEnhanced += `<sup>${verse.verse_id}</sup>${cleanVerseText} `;
    } else {
      this.textEnhanced += `${cleanVerseText} `;
    }
    this.texts.push(cleanVerseText);
  }

  setRef(ref) {
    this.ref = `${ref} ${this.version.ref}`;
    this.refEnhanced = `${ref} <abbr title="${this.version.name}">${this.version.ref}</abbr>`;
  }
}

module.exports = VerseResponseResult;
