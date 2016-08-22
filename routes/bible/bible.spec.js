const server = require('../../server');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const agent = supertest.agent(server);
const nock = require('nock');
const config = require('../../server.config');

const using = require('data-driven');

const chapterDbtResponse = require('../../utdata/bible/verse-search/one-version/get-chapter/dbt.json');
const chapterExpected = require('../../utdata/bible/verse-search/one-version/get-chapter/expected.json');
const verseDbtResponse = require('../../utdata/bible/verse-search/one-version/get-verse/dbt.json');
const verseExpected = require('../../utdata/bible/verse-search/one-version/get-verse/expected.json');
const versesDbtResponse = require('../../utdata/bible/verse-search/one-version/get-verses/dbt.json');
const versesExpected = require('../../utdata/bible/verse-search/one-version/get-verses/expected.json');

const versesAsVerseDbtResponse = require('../../utdata/bible/verse-search/one-version/get-verses-as-verse/dbt.json');
const versesAsVerseExpected = require('../../utdata/bible/verse-search/one-version/get-verses-as-verse/expected.json');
const versesLastVerseAsVerseDbtResponse = require('../../utdata/bible/verse-search/one-version/get-verses-last-verse-as-verse/dbt.json');
const versesLastVerseAsVerseExpected = require('../../utdata/bible/verse-search/one-version/get-verses-last-verse-as-verse/expected.json');

const chapterDbtResponseESV = require('../../utdata/bible/verse-search/multiple-versions/get-chapter/dbt-esv.json');
const chapterDbtResponseKJV = require('../../utdata/bible/verse-search/multiple-versions/get-chapter/dbt-kjv.json');
const chapterExpectedMultiple = require('../../utdata/bible/verse-search/multiple-versions/get-chapter/expected.json');

const verseDbtResponseESV = require('../../utdata/bible/verse-search/multiple-versions/get-verse/dbt-esv.json');
const verseDbtResponseKJV = require('../../utdata/bible/verse-search/multiple-versions/get-verse/dbt-kjv.json');
const verseExpectedMultiple = require('../../utdata/bible/verse-search/multiple-versions/get-verse/expected.json');

const versesDbtResponseESV = require('../../utdata/bible/verse-search/multiple-versions/get-verses/dbt-esv.json');
const versesDbtResponseKJV = require('../../utdata/bible/verse-search/multiple-versions/get-verses/dbt-kjv.json');
const versesExpectedMultiple = require('../../utdata/bible/verse-search/multiple-versions/get-verses/expected.json');

const defaultVersionsDbtResponseESV = require('../../utdata/bible/verse-search/multiple-versions/default-versions/dbt-esv.json');
const defaultVersionsDbtResponseWEB = require('../../utdata/bible/verse-search/multiple-versions/default-versions/dbt-web.json');
const defaultVersionsDbtResponseNASB = require('../../utdata/bible/verse-search/multiple-versions/default-versions/dbt-nasb.json');
const defaultVersionsDbtResponseKJV = require('../../utdata/bible/verse-search/multiple-versions/default-versions/dbt-kjv.json');
const defaultVersionsExpectedMultiple = require('../../utdata/bible/verse-search/multiple-versions/default-versions/expected.json');

const versionOrderingDbtResponseNASB = require('../../utdata/bible/verse-search/multiple-versions/version-ordering/dbt-nasb.json');
const versionOrderingDbtResponseKJV = require('../../utdata/bible/verse-search/multiple-versions/version-ordering/dbt-kjv.json');
const versionOrderingDbtResponseWEB = require('../../utdata/bible/verse-search/multiple-versions/version-ordering/dbt-web.json');
const versionOrderingExpectedMultiple = require('../../utdata/bible/verse-search/multiple-versions/version-ordering/expected.json');

const freeTextDbtNoResultsResponse = [[{'total_results': '0'}], []];

const freeTextDbtResponse = require('../../utdata/bible/free-text-search/one-version/get-verses/dbt.json');
const freeTextExpected = require('../../utdata/bible/free-text-search/one-version/get-verses/expected.json');

const freeTextDbtResponseESV = require('../../utdata/bible/free-text-search/multiple-versions/get-verses/dbt-esv.json');
const freeTextDbtResponseKJV = require('../../utdata/bible/free-text-search/multiple-versions/get-verses/dbt-kjv.json');
const freeTextExpectedMultiple = require('../../utdata/bible/free-text-search/multiple-versions/get-verses/expected.json');

const freeTextOneMatchingDbtResponseKJV = require('../../utdata/bible/free-text-search/multiple-versions/get-verses-one-matching-version/dbt-kjv.json');
const freeTextOneMatchingExpectedMultiple = require('../../utdata/bible/free-text-search/multiple-versions/get-verses-one-matching-version/expected.json');

const freeTextDefaultVersionsDbtResponseESV = require('../../utdata/bible/free-text-search/multiple-versions/default-versions/dbt-esv.json');
const freeTextDefaultVersionsDbtResponseWEB = require('../../utdata/bible/free-text-search/multiple-versions/default-versions/dbt-web.json');
const freeTextDefaultVersionsDbtResponseNASB = require('../../utdata/bible/free-text-search/multiple-versions/default-versions/dbt-nasb.json');
const freeTextDefaultVersionsDbtResponseKJV = require('../../utdata/bible/free-text-search/multiple-versions/default-versions/dbt-kjv.json');
const freeTextDefaultVersionsExpectedMultiple = require('../../utdata/bible/free-text-search/multiple-versions/default-versions/expected.json');

const verseVersionOrderingDbtResponseKJV = require('../../utdata/bible/free-text-search/multiple-versions/verse-version-ordering/dbt-kjv.json');
const verseVersionOrderingDbtResponseESV = require('../../utdata/bible/free-text-search/multiple-versions/verse-version-ordering/dbt-esv.json');
const verseVersionOrderingExpectedMultiple = require('../../utdata/bible/free-text-search/multiple-versions/verse-version-ordering/expected.json');

// nock.recorder.rec();

describe('bible', () => {

  describe('verse search', () => {

    describe('fundamentals', () => {

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
        expect(books).to.have.length(66);

        let nocker = nock(config.proxy)
          .get('http://dbt.io/text/verse')
          .times(66)
          .query((query) => {
            return query['dam_id'] === 'ENGKJVO2ET' || query['dam_id'] === 'ENGKJVN2ET';
          })
          .reply(200, chapterDbtResponse);

        for (let book of books) {
          agent
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

        agent
          .get('/bible?q=Gonesis 1&versions=kjv')
          .expect(404, (err) => {
            done(err);
          });
      });

    });

    describe('errors', () => {

      describe('timeout', () => {

        let nocker;
        let initNock = (socketDelay) => {
          nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .socketDelay(socketDelay)
            .reply(200, chapterDbtResponse);
        };

        it('should not timeout', (done) => {
          initNock(config.timeout.upstream - 1000);
          agent
            .get('/bible?q=Psalms 117&versions=kjv')
            .expect(200, chapterExpected, (err) => {
              nocker.done();
              done(err);
            });
        });

        it('should respond 408 on timeout', (done) => {
          initNock(config.timeout.upstream + 1000);
          agent
            .get('/bible?q=Psalms 117&versions=kjv')
            .expect(408, (err) => {
              nocker.done();
              done(err);
            });

        });
      });

      describe('unexpected upstream response', () => {

        it('should respond 502 where upstream response is non 2XX', (done) => {

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(418); // I'm a teapot

          agent
            .get('/bible?q=Psalms 117&versions=kjv')
            .expect(502, (err) => {
              nocker.done();
              done(err);
            });
        });

        it('should respond 502 where upstream errors', (done) => {

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .replyWithError();

          agent
            .get('/bible?q=Psalms 117&versions=kjv')
            .expect(502, (err) => {
              nocker.done();
              done(err);
            });
        });

      });

      describe('bad request', () => {

        it('should respond 400 where no query is given', (done) => {
          agent
            .get('/bible?q=&versions=kjv')
            .expect(400, (err) => {
              done(err);
            });
        });

      });
    });

    describe('one version', () => {

      let chapterObj = {
        testName: 'chapter',
        path: '/bible?q=Psalms 117&versions=kjv',
        nockResponse: chapterDbtResponse,
        expected: chapterExpected
      };

      let verseObj = {
        testName: 'verse',
        path: '/bible?q=Psalms 118:2&versions=kjv',
        nockResponse: verseDbtResponse,
        expected: verseExpected
      };

      let versesObj = {
        testName: 'verses',
        path: '/bible?q=Psalms 119:2-3&versions=kjv',
        nockResponse: versesDbtResponse,
        expected: versesExpected
      };

      describe('get scripture', () => {

        let nocker;
        let initNock = (response) => {
          nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, response);
        };

        using([chapterObj, verseObj, versesObj], function () {

          it('should get {testName}', (testObj, done) => {
            initNock(testObj.nockResponse);
            agent
              .get(testObj.path)
              .expect(200, testObj.expected, (err) => {
                nocker.done();
                done(err);
              });
          });

          it('should respond 404 where {testName} does not exist', (testObj, done) => {
            initNock([]);
            agent
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

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .times(2)
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, versesDbtResponse);

          agent
            .get('/bible?q=psalms 119:2-3&versions=kjv')
            .expect(200, versesExpected, (err) => {
              if (err) {
                done(err);
              } else {
                agent
                  .get('/bible?q=PSALMS 119:2-3&versions=KJV')
                  .expect(200, versesExpected, (err) => {
                    nocker.done();
                    done(err);
                  });
              }
            });

        });

        it('should record "verse" as subtype for a "verses" search where "from verse" equals "to verse"', (done) => {

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, versesAsVerseDbtResponse);

          agent
            .get('/bible?q=Psalms 119:3-3&versions=kjv')
            .expect(200, versesAsVerseExpected, (err) => {
              nocker.done();
              done(err);
            });

        });

        it('should record "verse" as subtype for a "verses" search where "from verse" is the last verse in the chapter', (done) => {

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, versesLastVerseAsVerseDbtResponse);

          agent
            .get('/bible?q=Psalms 119:176-500&versions=kjv')
            .expect(200, versesLastVerseAsVerseExpected, (err) => {
              nocker.done();
              done(err);
            });

        });

        it('should switch "from verse" with "to verse" where "from verse" > "to verse"', (done) => {

          let verseStart = 3;
          let verseEnd = 2;

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET'
                && parseInt(query['verse_start']) === verseEnd
                && parseInt(query['verse_end']) === verseStart;
            })
            .reply(200, versesDbtResponse);

          agent
            .get(`/bible?q=Psalms 119:${verseStart}-${verseEnd}&versions=kjv`)
            .expect(200, versesExpected, (err) => {
              nocker.done();
              done(err);
            });

        });

      });
    });

    describe('multiple versions', () => {

      let chapterObj = {
        testName: 'chapter',
        path: '/bible?q=Psalms 117&versions=kjv,esv',
        nockResponses: [chapterDbtResponseKJV, chapterDbtResponseESV],
        expected: chapterExpectedMultiple
      };

      let verseObj = {
        testName: 'verse',
        path: '/bible?q=Psalms 118:2&versions=kjv,esv',
        nockResponses: [verseDbtResponseKJV, verseDbtResponseESV],
        expected: verseExpectedMultiple
      };

      let versesObj = {
        testName: 'verses',
        path: '/bible?q=Psalms 119:2-3&versions=kjv,esv',
        nockResponses: [versesDbtResponseKJV, versesDbtResponseESV],
        expected: versesExpectedMultiple
      };

      describe('get scripture', () => {

        let nocker1;
        let nocker2;
        let initNock = (responses) => {
          nocker1 = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, responses[0]);

          nocker2 = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGESVO2ET';
            })
            .reply(200, responses[1]);
        };

        using([chapterObj, verseObj, versesObj], function () {

          it('should get {testName}', (testObj, done) => {

            initNock(testObj.nockResponses);
            agent
              .get(testObj.path)
              .expect(200, testObj.expected, (err) => {
                nocker1.done();
                nocker2.done();
                done(err);
              });
          });

          it('should respond 404 where {testName} does not exist', (testObj, done) => {

            initNock([[], []]);
            agent
              .get(testObj.path)
              .expect(404, (err) => {
                nocker1.done();
                nocker2.done();
                done(err);
              });
          });

        });
      });

      let defaultVersions = {
        testName: 'should support default versions of esv,web,nasb,kjv',
        path: '/bible?q=Genesis 1:2'
      };

      let allInvalidVersions = {
        testName: 'should revert to default versions where all versions are invalid',
        path: '/bible?q=Genesis 1:2&versions=oops,doh'
      };

      describe('default versions', () => {

        let nockDefaultVersionsESV, nockDefaultVersionsWEB, nockDefaultVersionsNASB, nockDefaultVersionsKJV;

        // noinspection ES6ModulesDependencies
        beforeEach(() => {

          nockDefaultVersionsESV = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGESVO2ET';
            })
            .reply(200, defaultVersionsDbtResponseESV);

          nockDefaultVersionsWEB = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGWEBO2ET';
            })
            .reply(200, defaultVersionsDbtResponseWEB);

          nockDefaultVersionsNASB = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGNASO2ET';
            })
            .reply(200, defaultVersionsDbtResponseNASB);

          nockDefaultVersionsKJV = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, defaultVersionsDbtResponseKJV);

        });

        using([defaultVersions, allInvalidVersions], function () {

          it('{testName}', (testObj, done) => {

            agent
              .get(testObj.path)
              .expect(200, defaultVersionsExpectedMultiple, (err, res) => {
                let body = res.body;
                expect(body.results).to.have.length(4);
                expect(body.results[0].version.ref).to.equal('ESV');
                expect(body.results[1].version.ref).to.equal('WEB');
                expect(body.results[2].version.ref).to.equal('NASB');
                expect(body.results[3].version.ref).to.equal('KJV');
                nockDefaultVersionsESV.done();
                nockDefaultVersionsWEB.done();
                nockDefaultVersionsNASB.done();
                nockDefaultVersionsKJV.done();
                done(err);
              });
          });

        });
      });

      describe('other', () => {

        it('should respect version ordering and ignore invalid versions', (done) => {

          let nockVersionOrderingNASB = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGNASO2ET';
            })
            .reply(200, versionOrderingDbtResponseNASB);

          let nockVersionOrderingKJV = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2ET';
            })
            .reply(200, versionOrderingDbtResponseKJV);

          let nockVersionOrderingWEB = nock(config.proxy)
            .get('http://dbt.io/text/verse')
            .query((query) => {
              return query['dam_id'] === 'ENGWEBO2ET';
            })
            .reply(200, versionOrderingDbtResponseWEB);

          agent
            .get('/bible?q=Genesis 1:3&versions=nasb,kjv,oops,web')
            .expect(200, versionOrderingExpectedMultiple, (err, res) => {
              let body = res.body;
              expect(body.results).to.have.length(3);
              expect(body.results[0].version.ref).to.equal('NASB');
              expect(body.results[1].version.ref).to.equal('KJV');
              expect(body.results[2].version.ref).to.equal('WEB');
              nockVersionOrderingNASB.done();
              nockVersionOrderingKJV.done();
              nockVersionOrderingWEB.done();
              done(err);
            });
        });

      });
    });
  });

  describe('free text search', () => {
    describe('errors', () => {

      describe('timeout', () => {

        let nocker;
        let initNock = (socketDelay) => {
          nocker = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .socketDelay(socketDelay)
            .reply(200, freeTextDbtResponse);
        };

        it('should not timeout', (done) => {
          initNock(config.timeout.upstream - 1000);
          agent
            .get('/bible?q=For God so|so loved&versions=kjv')
            .expect(200, freeTextExpected, (err) => {
              nocker.done();
              done(err);
            });
        });

        it('should respond 408 on timeout', (done) => {
          initNock(config.timeout.upstream + 1000);
          agent
            .get('/bible?q=For God so|so loved&versions=kjv')
            .expect(408, (err) => {
              nocker.done();
              done(err);
            });

        });
      });

      describe('unexpected upstream response', () => {

        it('should respond 502 where upstream response is non 2XX', (done) => {

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .reply(418); // I'm a teapot

          agent
            .get('/bible?q=For God so|so loved&versions=kjv')
            .expect(502, (err) => {
              nocker.done();
              done(err);
            });
        });

        it('should respond 502 where upstream errors', (done) => {

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .replyWithError();

          agent
            .get('/bible?q=For God so|so loved&versions=kjv')
            .expect(502, (err) => {
              nocker.done();
              done(err);
            });
        });

      });

      describe('bad request', () => {

        it('should respond 400 where no query is given', (done) => {
          agent
            .get('/bible?q=&versions=kjv')
            .expect(400, (err) => {
              done(err);
            });
        });

      });
    });

    describe('one version', () => {

      describe('get scripture', () => {

        let testObj = {
          testName: 'verses',
          path: '/bible?q=For God so|so loved&versions=kjv',
          response: freeTextDbtResponse,
          expected: freeTextExpected
        };

        let nocker;
        let initNock = (response) => {
          nocker = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .reply(200, response);
        };

        it('should get verses', (done) => {

          initNock(testObj.response);

          agent
            .get(testObj.path)
            .expect(200, testObj.expected, (err, res) => {
              expect(res.body.results).to.have.length(3);
              nocker.done();
              done(err);
            });

        });

        it('should respond 404 where no verses can be found', (done) => {

          initNock(freeTextDbtNoResultsResponse);

          agent
            .get(testObj.path)
            .expect(404, (err) => {
              nocker.done();
              done(err);
            });

        });
      });

      describe('other', () => {

        it('should be case insensitive', (done) => {

          let myFreeTextExpectedQuery1 = freeTextExpected;
          myFreeTextExpectedQuery1.query = 'for God so|so loved';

          let myFreeTextExpectedQuery2 = freeTextExpected;
          myFreeTextExpectedQuery2.query = 'FOR GOD SO|SO LOVED';

          let nocker = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .times(2)
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .reply(200, freeTextDbtResponse);

          agent
            .get(`/bible?q=${myFreeTextExpectedQuery1.query}&versions=kjv`)
            .expect(200, myFreeTextExpectedQuery1, (err) => {
              if (err) {
                done(err);
              } else {
                agent
                  .get(`/bible?q=${myFreeTextExpectedQuery2.query}&versions=KJV`)
                  .expect(200, myFreeTextExpectedQuery2, (err) => {
                    nocker.done();
                    done(err);
                  });
              }
            });

        });
      });
    });

    describe('multiple versions', () => {

      describe('get scripture', () => {

        let getVersesObj = {
          testName: 'verses',
          path: '/bible?q=For God so|so loved&versions=kjv,esv',
          responses: [freeTextDbtResponseKJV, freeTextDbtResponseESV],
          expected: freeTextExpectedMultiple,
          expectedLength: 5
        };

        let getVersesOneMatchingVersionObj = {
          testName: 'verses where only one version has matching verses',
          path: '/bible?q=To bring the children of Israel out of the land of Egypt&versions=kjv,esv',
          responses: [freeTextOneMatchingDbtResponseKJV, freeTextDbtNoResultsResponse],
          expected: freeTextOneMatchingExpectedMultiple,
          expectedLength: 1
        };

        let nocker1;
        let nocker2;
        let initNock = (responses) => {
          nocker1 = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .reply(200, responses[0]);
          nocker2 = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGESVO2';
            })
            .reply(200, responses[1]);
        };

        using([getVersesObj, getVersesOneMatchingVersionObj], function () {

          it('should get {testName}', (testObj, done) => {

            initNock(testObj.responses);

            agent
              .get(testObj.path)
              .expect(200, testObj.expected, (err, res) => {
                expect(res.body.results).to.have.length(testObj.expectedLength);
                nocker1.done();
                nocker2.done();
                done(err);
              });

          });

        });

        it('should respond 404 where no verses can be found', (done) => {

          initNock([freeTextDbtNoResultsResponse, freeTextDbtNoResultsResponse]);

          agent
            .get(getVersesObj.path)
            .expect(404, (err) => {
              nocker1.done();
              nocker2.done();
              done(err);
            });

        });
      });

      let defaultVersions = {
        testName: 'should support default versions of esv,web,nasb,kjv',
        path: '/bible?q=the Word was God'
      };

      let allInvalidVersions = {
        testName: 'should revert to default versions where all versions are invalid',
        path: '/bible?q=the Word was God&versions=oops,doh'
      };

      describe('default versions', () => {

        let nockDefaultVersionsESV, nockDefaultVersionsWEB, nockDefaultVersionsNASB, nockDefaultVersionsKJV;

        beforeEach(() => {

          nockDefaultVersionsESV = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGESVO2';
            })
            .reply(200, freeTextDefaultVersionsDbtResponseESV);

          nockDefaultVersionsWEB = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGWEBO2';
            })
            .reply(200, freeTextDefaultVersionsDbtResponseWEB);

          nockDefaultVersionsNASB = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGNASO2';
            })
            .reply(200, freeTextDefaultVersionsDbtResponseNASB);

          nockDefaultVersionsKJV = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .reply(200, freeTextDefaultVersionsDbtResponseKJV);
        });

        using([defaultVersions, allInvalidVersions], function () {

          it('{testName}', (testObj, done) => {

            agent
              .get(testObj.path)
              .expect(200, freeTextDefaultVersionsExpectedMultiple, (err, res) => {
                let body = res.body;
                expect(body.results).to.have.length(4);
                expect(body.results[0].version.ref).to.equal('ESV');
                expect(body.results[1].version.ref).to.equal('WEB');
                expect(body.results[2].version.ref).to.equal('NASB');
                expect(body.results[3].version.ref).to.equal('KJV');
                nockDefaultVersionsESV.done();
                nockDefaultVersionsWEB.done();
                nockDefaultVersionsNASB.done();
                nockDefaultVersionsKJV.done();
                done(err);

              });
          });
        });
      });

      describe('other', () => {

        it('should respect verse -> version ordering and ignore invalid versions', (done) => {

          let nockVerseVersionOrderingKJV = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGKJVO2';
            })
            .reply(200, verseVersionOrderingDbtResponseKJV);

          let nockVerseVersionOrderingESV = nock(config.proxy)
            .get('http://dbt.io/text/search')
            .query((query) => {
              return query['dam_id'] === 'ENGESVO2';
            })
            .reply(200, verseVersionOrderingDbtResponseESV);

          agent
            .get('/bible?q=In the beginning|so loved&versions=kjv,oops,esv')
            .expect(200, verseVersionOrderingExpectedMultiple, (err, res) => {
              let body = res.body;
              expect(body.results).to.have.length(34);
              expect(body.results[0].version.ref).to.equal('KJV');
              expect(body.results[1].version.ref).to.equal('ESV');
              nockVerseVersionOrderingKJV.done();
              nockVerseVersionOrderingESV.done();
              done(err);
            });
        });

      });
    });
  });
});
