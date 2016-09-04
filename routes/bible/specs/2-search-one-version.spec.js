const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';
const dbtResponseNoResults = [[{'total_results': '0'}], []];

const dbtResponse = require(`${UTDATA}/bible/search/one-version/get-verses/dbt.json`);
const expected = require(`${UTDATA}/bible/search/one-version/get-verses/expected.json`);

let testObj = {
  path: '/bible?q=For God so|so loved&versions=kjv',
  nockResponse: dbtResponse,
  expected: expected
};

// nock.recorder.rec();

describe('SEARCH one version', () => {

  describe('get scripture', () => {

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
      initNock(testObj.nockResponse);
      Imp.agent
        .get(testObj.path)
        .expect(200, testObj.expected, (err, res) => {
          Imp.expect(res.body.results).to.have.length(3);
          nocker.done();
          done(err);
        });
    });

    it('should respond 404 where no verses can be found', (done) => {
      initNock(dbtResponseNoResults);
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

      let query1Expected = expected;
      query1Expected.query = 'for God so|so loved';

      let query2Expected = expected;
      query2Expected.query = 'FOR GOD SO|SO LOVED';

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .times(2)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(200, dbtResponse);

      Imp.agent
        .get(`/bible?q=${query1Expected.query}&versions=kjv`)
        .expect(200, query1Expected, (err) => {
          if (err) {
            done(err);
          } else {
            Imp.agent
              .get(`/bible?q=${query2Expected.query}&versions=KJV`)
              .expect(200, query2Expected, (err) => {
                nocker.done();
                done(err);
              });
          }
        });

    });
  });
});
