const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';

const freeTextDbtNoResultsResponse = [[{'total_results': '0'}], []];

const freeTextDbtResponse = require(`${UTDATA}/bible/free-text-search/one-version/get-verses/dbt.json`);
const freeTextExpected = require(`${UTDATA}/bible/free-text-search/one-version/get-verses/expected.json`);

// nock.recorder.rec();

describe('SEARCH one version', () => {

  describe('get scripture', () => {

    let testObj = {
      testName: 'verses',
      path: '/bible?q=For God so|so loved&versions=kjv',
      response: freeTextDbtResponse,
      expected: freeTextExpected
    };

    let nocker;
    let initNock = (response) => {
      nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, response);
    };

    it('should get verses', (done) => {

      initNock(testObj.response);

      Imp.agent
        .get(testObj.path)
        .expect(200, testObj.expected, (err, res) => {
          Imp.expect(res.body.results).to.have.length(3);
          nocker.done();
          done(err);
        });

    });

    it('should respond 404 where no verses can be found', (done) => {

      initNock(freeTextDbtNoResultsResponse);

      Imp.agent
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

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .times(2)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, freeTextDbtResponse);

      Imp.agent
        .get(`/bible?q=${myFreeTextExpectedQuery1.query}&versions=kjv`)
        .expect(200, myFreeTextExpectedQuery1, (err) => {
          if (err) {
            done(err);
          } else {
            Imp.agent
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
