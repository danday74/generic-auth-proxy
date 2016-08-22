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
}

module.exports = VerseResponseResult;
