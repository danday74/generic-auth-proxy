const Imp = require('../classes/TestImports');
const UTDATA = appRoot + '/utdata';

const chapterDbtResponseESV = require(`${UTDATA}/bible/verse/many-versions/get-chapter/dbt-esv.json`);
const chapterDbtResponseKJV = require(`${UTDATA}/bible/verse/many-versions/get-chapter/dbt-kjv.json`);
const chapterExpected = require(`${UTDATA}/bible/verse/many-versions/get-chapter/expected.json`);

const verseDbtResponseESV = require(`${UTDATA}/bible/verse/many-versions/get-verse/dbt-esv.json`);
const verseDbtResponseKJV = require(`${UTDATA}/bible/verse/many-versions/get-verse/dbt-kjv.json`);
const verseExpected = require(`${UTDATA}/bible/verse/many-versions/get-verse/expected.json`);

const versesDbtResponseESV = require(`${UTDATA}/bible/verse/many-versions/get-verses/dbt-esv.json`);
const versesDbtResponseKJV = require(`${UTDATA}/bible/verse/many-versions/get-verses/dbt-kjv.json`);
const versesExpected = require(`${UTDATA}/bible/verse/many-versions/get-verses/expected.json`);

const defaultVersionsDbtResponseESV = require(`${UTDATA}/bible/verse/many-versions/default-versions/dbt-esv.json`);
const defaultVersionsDbtResponseKJV = require(`${UTDATA}/bible/verse/many-versions/default-versions/dbt-kjv.json`);
const defaultVersionsDbtResponseNASB = require(`${UTDATA}/bible/verse/many-versions/default-versions/dbt-nasb.json`);
const defaultVersionsDbtResponseWEB = require(`${UTDATA}/bible/verse/many-versions/default-versions/dbt-web.json`);
const defaultVersionsExpected = require(`${UTDATA}/bible/verse/many-versions/default-versions/expected.json`);

const versionOrderingDbtResponseKJV = require(`${UTDATA}/bible/verse/many-versions/version-ordering/dbt-kjv.json`);
const versionOrderingDbtResponseNASB = require(`${UTDATA}/bible/verse/many-versions/version-ordering/dbt-nasb.json`);
const versionOrderingDbtResponseWEB = require(`${UTDATA}/bible/verse/many-versions/version-ordering/dbt-web.json`);
const versionOrderingExpected = require(`${UTDATA}/bible/verse/many-versions/version-ordering/expected.json`);

let testObjs = [
  {
    testName: 'chapter',
    path: '/bible?q=Psalms 117&versions=kjv,esv',
    nockResponses: [chapterDbtResponseKJV, chapterDbtResponseESV],
    expected: chapterExpected
  },
  {
    testName: 'verse',
    path: '/bible?q=Psalms 118:2&versions=kjv,esv',
    nockResponses: [verseDbtResponseKJV, verseDbtResponseESV],
    expected: verseExpected
  },
  {
    testName: 'verses',
    path: '/bible?q=Psalms 119:2-3&versions=kjv,esv',
    nockResponses: [versesDbtResponseKJV, versesDbtResponseESV],
    expected: versesExpected
  }
];

let defaultVersions = {
  testName: 'should support default versions of esv,web,nasb,kjv',
  path: '/bible?q=Genesis 1:2'
};

let allInvalidVersions = {
  testName: 'should revert to default versions where all versions are invalid',
  path: '/bible?q=Genesis 1:2&versions=oops,doh'
};

// nock.recorder.rec();

describe('VERSE many versions', () => {

  describe('get scripture', () => {

    Imp.using(testObjs, () => {

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
        .expect(200, versionOrderingExpected, (err, res) => {
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
