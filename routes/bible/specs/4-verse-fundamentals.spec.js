const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';

const chapterDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-chapter/dbt.json`);
const chapterExpected = require(`${UTDATA}/bible/verse/one-version/get-chapter/expected.json`);

// nock.recorder.rec();

describe('VERSE fundamentals', () => {

  it('should recognise the 66 bible books', (done) => {

    let books = [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
      'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
      'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
      'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
      'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
      'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
    ];
    Imp.expect(books).to.have.length(66);

    let nocker = Imp.nock(Imp.cfg.nock.url)
      .get(`${Imp.cfg.nock.pre}/text/verse`)
      .times(66)
      .query((query) => {
        return query['dam_id'] === 'ENGKJVO2ET' || query['dam_id'] === 'ENGKJVN2ET';
      })
      .reply(200, chapterDbtResponse);

    for (let book of books) {
      Imp.agent
        .get(`/bible?q=${book} 1&versions=kjv`)
        .expect(200, chapterExpected, (err) => {
          if (book === books[65]) {
            nocker.done();
            done(err);
          }
        });
    }
  });

  it('should respond 404 where a bible book cannot be identified', (done) => {
    Imp.agent
      .get('/bible?q=Gonesis 1&versions=kjv')
      .expect(404, (err) => {
        done(err);
      });

  });
});
