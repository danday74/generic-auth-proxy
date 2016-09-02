const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';

const chapterDbtResponseESV = require(`${UTDATA}/bible/verse-search/multiple-versions/get-chapter/dbt-esv.json`);
const chapterDbtResponseKJV = require(`${UTDATA}/bible/verse-search/multiple-versions/get-chapter/dbt-kjv.json`);
const chapterExpectedMultiple = require(`${UTDATA}/bible/verse-search/multiple-versions/get-chapter/expected.json`);

const verseDbtResponseESV = require(`${UTDATA}/bible/verse-search/multiple-versions/get-verse/dbt-esv.json`);
const verseDbtResponseKJV = require(`${UTDATA}/bible/verse-search/multiple-versions/get-verse/dbt-kjv.json`);
const verseExpectedMultiple = require(`${UTDATA}/bible/verse-search/multiple-versions/get-verse/expected.json`);

const versesDbtResponseESV = require(`${UTDATA}/bible/verse-search/multiple-versions/get-verses/dbt-esv.json`);
const versesDbtResponseKJV = require(`${UTDATA}/bible/verse-search/multiple-versions/get-verses/dbt-kjv.json`);
const versesExpectedMultiple = require(`${UTDATA}/bible/verse-search/multiple-versions/get-verses/expected.json`);

const defaultVersionsDbtResponseESV = require(`${UTDATA}/bible/verse-search/multiple-versions/default-versions/dbt-esv.json`);
const defaultVersionsDbtResponseWEB = require(`${UTDATA}/bible/verse-search/multiple-versions/default-versions/dbt-web.json`);
const defaultVersionsDbtResponseNASB = require(`${UTDATA}/bible/verse-search/multiple-versions/default-versions/dbt-nasb.json`);
const defaultVersionsDbtResponseKJV = require(`${UTDATA}/bible/verse-search/multiple-versions/default-versions/dbt-kjv.json`);
const defaultVersionsExpectedMultiple = require(`${UTDATA}/bible/verse-search/multiple-versions/default-versions/expected.json`);

const versionOrderingDbtResponseNASB = require(`${UTDATA}/bible/verse-search/multiple-versions/version-ordering/dbt-nasb.json`);
const versionOrderingDbtResponseKJV = require(`${UTDATA}/bible/verse-search/multiple-versions/version-ordering/dbt-kjv.json`);
const versionOrderingDbtResponseWEB = require(`${UTDATA}/bible/verse-search/multiple-versions/version-ordering/dbt-web.json`);
const versionOrderingExpectedMultiple = require(`${UTDATA}/bible/verse-search/multiple-versions/version-ordering/expected.json`);

// nock.recorder.rec();

describe('VERSE many versions', () => {

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
      nocker1 = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(200, responses[0]);

      nocker2 = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2ET';
        })
        .reply(200, responses[1]);
    };

    Imp.using([chapterObj, verseObj, versesObj], function () {

      it('should get {testName}', (testObj, done) => {

        initNock(testObj.nockResponses);
        Imp.agent
          .get(testObj.path)
          .expect(200, testObj.expected, (err) => {
            nocker1.done();
            nocker2.done();
            done(err);
          });
      });

      it('should respond 404 where {testName} does not exist', (testObj, done) => {

        initNock([[], []]);
        Imp.agent
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

    // noinspection ES6ModulesDependencies, NodeModulesDependencies
    beforeEach(() => {

      nockDefaultVersionsESV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2ET';
        })
        .reply(200, defaultVersionsDbtResponseESV);

      nockDefaultVersionsWEB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGWEBO2ET';
        })
        .reply(200, defaultVersionsDbtResponseWEB);

      nockDefaultVersionsNASB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGNASO2ET';
        })
        .reply(200, defaultVersionsDbtResponseNASB);

      nockDefaultVersionsKJV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(200, defaultVersionsDbtResponseKJV);

    });

    Imp.using([defaultVersions, allInvalidVersions], function () {

      it('{testName}', (testObj, done) => {

        Imp.agent
          .get(testObj.path)
          .expect(200, defaultVersionsExpectedMultiple, (err, res) => {
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

    it('should respect version ordering and ignore invalid versions', (done) => {

      let nockVersionOrderingNASB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGNASO2ET';
        })
        .reply(200, versionOrderingDbtResponseNASB);

      let nockVersionOrderingKJV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(200, versionOrderingDbtResponseKJV);

      let nockVersionOrderingWEB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGWEBO2ET';
        })
        .reply(200, versionOrderingDbtResponseWEB);

      Imp.agent
        .get('/bible?q=Genesis 1:3&versions=nasb,kjv,oops,web')
        .expect(200, versionOrderingExpectedMultiple, (err, res) => {
          let body = res.body;
          Imp.expect(body.results).to.have.length(3);
          Imp.expect(body.results[0].version.ref).to.equal('NASB');
          Imp.expect(body.results[1].version.ref).to.equal('KJV');
          Imp.expect(body.results[2].version.ref).to.equal('WEB');
          nockVersionOrderingNASB.done();
          nockVersionOrderingKJV.done();
          nockVersionOrderingWEB.done();
          done(err);
        });
    });

  });
});
