const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';

const freeTextDbtNoResultsResponse = [[{'total_results': '0'}], []];

const freeTextDbtResponseESV = require(`${UTDATA}/bible/free-text-search/many-versions/get-verses/dbt-esv.json`);
const freeTextDbtResponseKJV = require(`${UTDATA}/bible/free-text-search/many-versions/get-verses/dbt-kjv.json`);
const freeTextExpectedMultiple = require(`${UTDATA}/bible/free-text-search/many-versions/get-verses/expected.json`);

const freeTextOneMatchingDbtResponseKJV = require(`${UTDATA}/bible/free-text-search/many-versions/get-verses-one-matching-version/dbt-kjv.json`);
const freeTextOneMatchingExpectedMultiple = require(`${UTDATA}/bible/free-text-search/many-versions/get-verses-one-matching-version/expected.json`);

const freeTextDefaultVersionsDbtResponseESV = require(`${UTDATA}/bible/free-text-search/many-versions/default-versions/dbt-esv.json`);
const freeTextDefaultVersionsDbtResponseWEB = require(`${UTDATA}/bible/free-text-search/many-versions/default-versions/dbt-web.json`);
const freeTextDefaultVersionsDbtResponseNASB = require(`${UTDATA}/bible/free-text-search/many-versions/default-versions/dbt-nasb.json`);
const freeTextDefaultVersionsDbtResponseKJV = require(`${UTDATA}/bible/free-text-search/many-versions/default-versions/dbt-kjv.json`);
const freeTextDefaultVersionsExpectedMultiple = require(`${UTDATA}/bible/free-text-search/many-versions/default-versions/expected.json`);

const verseVersionOrderingDbtResponseKJV = require(`${UTDATA}/bible/free-text-search/many-versions/verse-version-ordering/dbt-kjv.json`);
const verseVersionOrderingDbtResponseESV = require(`${UTDATA}/bible/free-text-search/many-versions/verse-version-ordering/dbt-esv.json`);
const verseVersionOrderingExpectedMultiple = require(`${UTDATA}/bible/free-text-search/many-versions/verse-version-ordering/expected.json`);

// nock.recorder.rec();

describe('SEARCH many versions', () => {

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
      nocker1 = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, responses[0]);
      nocker2 = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, responses[1]);
    };

    Imp.using([getVersesObj, getVersesOneMatchingVersionObj], function () {

      it('should get {testName}', (testObj, done) => {

        initNock(testObj.responses);

        Imp.agent
          .get(testObj.path)
          .expect(200, testObj.expected, (err, res) => {
            Imp.expect(res.body.results).to.have.length(testObj.expectedLength);
            nocker1.done();
            nocker2.done();
            done(err);
          });

      });

    });

    it('should respond 404 where no verses can be found', (done) => {

      initNock([freeTextDbtNoResultsResponse, freeTextDbtNoResultsResponse]);

      Imp.agent
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

    // noinspection ES6ModulesDependencies, NodeModulesDependencies
    beforeEach(() => {

      nockDefaultVersionsESV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, freeTextDefaultVersionsDbtResponseESV);

      nockDefaultVersionsWEB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGWEBO2';
        })
        .reply(200, freeTextDefaultVersionsDbtResponseWEB);

      nockDefaultVersionsNASB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGNASO2';
        })
        .reply(200, freeTextDefaultVersionsDbtResponseNASB);

      nockDefaultVersionsKJV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, freeTextDefaultVersionsDbtResponseKJV);
    });

    Imp.using([defaultVersions, allInvalidVersions], function () {

      it('{testName}', (testObj, done) => {

        Imp.agent
          .get(testObj.path)
          .expect(200, freeTextDefaultVersionsExpectedMultiple, (err, res) => {
            let body = res.body;
            Imp.expect(body.results).to.have.length(4);
            Imp.expect(body.results[0].version.ref).to.equal('ESV');
            Imp.expect(body.results[1].version.ref).to.equal('WEB');
            Imp.expect(body.results[2].version.ref).to.equal('NASB');
            Imp.expect(body.results[3].version.ref).to.equal('KJV');
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

      let nockVerseVersionOrderingKJV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, verseVersionOrderingDbtResponseKJV);

      let nockVerseVersionOrderingESV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, verseVersionOrderingDbtResponseESV);

      Imp.agent
        .get('/bible?q=In the beginning|so loved&versions=kjv,oops,esv')
        .expect(200, verseVersionOrderingExpectedMultiple, (err, res) => {
          let body = res.body;
          Imp.expect(body.results).to.have.length(34);
          Imp.expect(body.results[0].version.ref).to.equal('KJV');
          Imp.expect(body.results[1].version.ref).to.equal('ESV');
          nockVerseVersionOrderingKJV.done();
          nockVerseVersionOrderingESV.done();
          done(err);
        });
    });

  });
});
