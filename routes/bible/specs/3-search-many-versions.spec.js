const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';

const dbtResponseESV = require(`${UTDATA}/bible/search/many-versions/get-verses/dbt-esv.json`);
const dbtResponseKJV = require(`${UTDATA}/bible/search/many-versions/get-verses/dbt-kjv.json`);
const expected = require(`${UTDATA}/bible/search/many-versions/get-verses/expected.json`);

const oneMatchingVersionDbtResponseKJV = require(`${UTDATA}/bible/search/many-versions/get-verses-one-matching-version/dbt-kjv.json`);
const oneMatchingVersionExpected = require(`${UTDATA}/bible/search/many-versions/get-verses-one-matching-version/expected.json`);

const defaultVersionsDbtResponseESV = require(`${UTDATA}/bible/search/many-versions/default-versions/dbt-esv.json`);
const defaultVersionsDbtResponseKJV = require(`${UTDATA}/bible/search/many-versions/default-versions/dbt-kjv.json`);
const defaultVersionsDbtResponseNASB = require(`${UTDATA}/bible/search/many-versions/default-versions/dbt-nasb.json`);
const defaultVersionsDbtResponseWEB = require(`${UTDATA}/bible/search/many-versions/default-versions/dbt-web.json`);
const defaultVersionsExpected = require(`${UTDATA}/bible/search/many-versions/default-versions/expected.json`);

const verseVersionOrderingDbtResponseESV = require(`${UTDATA}/bible/search/many-versions/verse-version-ordering/dbt-esv.json`);
const verseVersionOrderingDbtResponseKJV = require(`${UTDATA}/bible/search/many-versions/verse-version-ordering/dbt-kjv.json`);
const verseVersionOrderingExpected = require(`${UTDATA}/bible/search/many-versions/verse-version-ordering/expected.json`);

let defaultVersions = {
  testName: 'should support default versions of esv,web,nasb,kjv',
  path: '/bible?q=the Word was God'
};

let allInvalidVersions = {
  testName: 'should revert to default versions where all versions are invalid',
  path: '/bible?q=the Word was God&versions=oops,doh'
};

// nock.recorder.rec();

describe('SEARCH many versions', () => {

  describe('get scripture', () => {

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

    it('should get verses', (done) => {
      initNock([dbtResponseKJV, dbtResponseESV]);
      Imp.agent
        .get('/bible?q=so loved&versions=kjv,esv')
        .expect(200, expected, (err, res) => {
          Imp.expect(res.body.results).to.have.length(5);
          nocker1.done();
          nocker2.done();
          done(err);
        });
    });

    it('should get verses where only one version has matching verses', (done) => {
      initNock([oneMatchingVersionDbtResponseKJV, Imp.dbtSearchResponseNoResults]);
      Imp.agent
        .get('/bible?q=To bring the children of Israel out of the land of Egypt&versions=kjv,esv')
        .expect(200, oneMatchingVersionExpected, (err, res) => {
          Imp.expect(res.body.results).to.have.length(1);
          nocker1.done();
          nocker2.done();
          done(err);
        });
    });

    it('should respond 404 where no verses can be found', (done) => {
      initNock([Imp.dbtSearchResponseNoResults, Imp.dbtSearchResponseNoResults]);
      Imp.agent
        .get('/bible?q=some unusual search text&versions=kjv,esv')
        .expect(404, (err) => {
          nocker1.done();
          nocker2.done();
          done(err);
        });

    });
  });

  describe('default versions', () => {

    let nockDefaultVersionsESV, nockDefaultVersionsWEB, nockDefaultVersionsNASB, nockDefaultVersionsKJV;

    // noinspection ES6ModulesDependencies, NodeModulesDependencies
    beforeEach(() => {

      nockDefaultVersionsESV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, defaultVersionsDbtResponseESV);

      nockDefaultVersionsWEB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGWEBO2';
        })
        .reply(200, defaultVersionsDbtResponseWEB);

      nockDefaultVersionsNASB = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGNASO2';
        })
        .reply(200, defaultVersionsDbtResponseNASB);

      nockDefaultVersionsKJV = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, defaultVersionsDbtResponseKJV);
    });

    Imp.using([defaultVersions, allInvalidVersions], () => {

      it('{testName}', (testObj, done) => {

        Imp.agent
          .get(testObj.path)
          .expect(200, defaultVersionsExpected, (err, res) => {
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
        .expect(200, verseVersionOrderingExpected, (err, res) => {
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
