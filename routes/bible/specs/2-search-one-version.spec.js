const Imp = require('../classes/TestImports');
const UTDATA = appRoot + '/utdata';

const dbtResponse = require(`${UTDATA}/bible/search/one-version/get-verses/dbt.json`);
const expected = require(`${UTDATA}/bible/search/one-version/get-verses/expected.json`);
const orHighlightingDbtResponse = require(`${UTDATA}/bible/search/one-version/or-highlighting/dbt.json`);
const orHighlightingExpected = require(`${UTDATA}/bible/search/one-version/or-highlighting/expected.json`);
const multipleHighlightingDbtResponse = require(`${UTDATA}/bible/search/one-version/multiple-highlighting/dbt.json`);
const multipleHighlightingExpected = require(`${UTDATA}/bible/search/one-version/multiple-highlighting/expected.json`);
const noOverlappedHighlightingDbtResponse = require(`${UTDATA}/bible/search/one-version/no-overlapped-highlighting/dbt.json`);
const noOverlappedHighlightingExpected = require(`${UTDATA}/bible/search/one-version/no-overlapped-highlighting/expected.json`);

let testObj = {
  path: '/bible?q=so loved&versions=kjv',
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
      initNock(Imp.dbtSearchResponseNoResults);
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

      let query1Expected = Object.assign({}, expected);
      query1Expected.query = 'so loved';

      let query2Expected = Object.assign({}, expected);
      query2Expected.query = 'SO LOVED';

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

    it('should support OR highlighting', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, orHighlightingDbtResponse);

      Imp.agent
        .get('/bible?q=Jesus wept|worthy is the Lamb&versions=esv')
        .expect(200, orHighlightingExpected, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should support multiple highlighting within the same verse', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, multipleHighlightingDbtResponse);

      Imp.agent
        .get('/bible?q=for God so|that whoever believes in him&versions=esv')
        .expect(200, multipleHighlightingExpected, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should prevent overlapped highlighting within the same verse', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGESVO2';
        })
        .reply(200, noOverlappedHighlightingDbtResponse);

      Imp.agent
        .get('/bible?q=whoever believes in him should not perish but have|should not perish but have eternal life&versions=esv')
        .expect(200, noOverlappedHighlightingExpected, (err) => {
          nocker.done();
          done(err);
        });

    });
  });
});
