const Imp = require('../classes/TestImports');
const UTDATA = appRoot + '/utdata';

const chapterDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-chapter/dbt.json`);
const chapterExpected = require(`${UTDATA}/bible/verse/one-version/get-chapter/expected.json`);
const verseDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-verse/dbt.json`);
const verseExpected = require(`${UTDATA}/bible/verse/one-version/get-verse/expected.json`);
const versesDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-verses/dbt.json`);
const versesExpected = require(`${UTDATA}/bible/verse/one-version/get-verses/expected.json`);

const versesAsVerseDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-verses-as-verse/dbt.json`);
const versesAsVerseExpected = require(`${UTDATA}/bible/verse/one-version/get-verses-as-verse/expected.json`);
const versesLastVerseAsVerseDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-verses-last-verse-as-verse/dbt.json`);
const versesLastVerseAsVerseExpected = require(`${UTDATA}/bible/verse/one-version/get-verses-last-verse-as-verse/expected.json`);

let testObjs = [{
  testName: 'chapter',
  path: '/bible?q=Psalms 117&versions=kjv',
  nockResponse: chapterDbtResponse,
  expected: chapterExpected
}, {
  testName: 'verse',
  path: '/bible?q=Psalms 118:2&versions=kjv',
  nockResponse: verseDbtResponse,
  expected: verseExpected
}, {
  testName: 'verses',
  path: '/bible?q=Psalms 119:2-3&versions=kjv',
  nockResponse: versesDbtResponse,
  expected: versesExpected
}];

// nock.recorder.rec();

describe('VERSE one version', () => {

  describe('get scripture', () => {

    Imp.using(testObjs, () => {

      let nocker;
      let initNock = (response) => {
        nocker = Imp.nock(Imp.cfg.nock.url)
          .get(`${Imp.cfg.nock.pre}/text/verse`)
          .query((query) => {
            return query['dam_id'] === 'ENGKJVO2ET';
          })
          .reply(200, response);
      };

      it('should get {testName}', (testObj, done) => {
        initNock(testObj.nockResponse);
        Imp.agent
          .get(testObj.path)
          .expect(200, testObj.expected, (err) => {
            nocker.done();
            done(err);
          });
      });

      it('should respond 404 where {testName} does not exist', (testObj, done) => {
        initNock([]);
        Imp.agent
          .get(testObj.path)
          .expect(404, (err) => {
            nocker.done();
            done(err);
          });

      });
    });
  });

  describe('other', () => {

    it('should be case insensitive', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .times(2)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(200, versesDbtResponse);

      Imp.agent
        .get('/bible?q=psalms 119:2-3&versions=kjv')
        .expect(200, versesExpected, (err) => {
          if (err) {
            done(err);
          } else {
            Imp.agent
              .get('/bible?q=PSALMS 119:2-3&versions=KJV')
              .expect(200, versesExpected, (err) => {
                nocker.done();
                done(err);
              });
          }
        });
    });

    it('should record "verse" as subtype for a "verses" search where "from verse" equals "to verse"', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(200, versesAsVerseDbtResponse);

      Imp.agent
        .get('/bible?q=Psalms 119:3-3&versions=kjv')
        .expect(200, versesAsVerseExpected, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should record "verse" as subtype for a "verses" search where "from verse" is the last verse in the chapter', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(200, versesLastVerseAsVerseDbtResponse);

      Imp.agent
        .get('/bible?q=Psalms 119:176-500&versions=kjv')
        .expect(200, versesLastVerseAsVerseExpected, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should switch "from verse" with "to verse" where "from verse" > "to verse"', (done) => {

      let verseStart = 3;
      let verseEnd = 2;

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET'
            && parseInt(query['verse_start']) === verseEnd
            && parseInt(query['verse_end']) === verseStart;
        })
        .reply(200, versesDbtResponse);

      Imp.agent
        .get(`/bible?q=Psalms 119:${verseStart}-${verseEnd}&versions=kjv`)
        .expect(200, versesExpected, (err) => {
          nocker.done();
          done(err);
        });

    });
  });
});
