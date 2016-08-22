class VerseInformation {

  constructor(chapter, verseStart, verseEnd) {
    this.chapter = parseInt(chapter);
    this.verseStart = verseStart ? parseInt(verseStart) : undefined;
    this.verseEnd = verseEnd ? parseInt(verseEnd) : undefined;
    this.type = undefined;
    this.url = undefined;
    this.autoFix();
  }

  setType() {
    this.type = 'chapter';
    if (this.verseStart) {
      this.type = 'verse';
      if (this.verseEnd) {
        this.type = 'verses';
      }
    }
  }

  setUrl() {
    this.url = `&chapter_id=${this.chapter}`;
    if (this.verseStart) {
      this.url += `&verse_start=${this.verseStart}`;
      if (this.verseEnd) {
        this.url += `&verse_end=${this.verseEnd}`;
      }
    }
  }

  autoFix() {
    if (this.verseStart && this.verseEnd && this.verseStart > this.verseEnd) {
      let temp = this.verseStart;
      this.verseStart = this.verseEnd;
      this.verseEnd = temp;
    }
    this.setType();
    this.setUrl();
  }
}

module.exports = VerseInformation;
