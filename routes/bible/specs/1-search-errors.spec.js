const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';
const freeTextDbtResponse = require(`${UTDATA}/bible/free-text-search/one-version/get-verses/dbt.json`);
const freeTextExpected = require(`${UTDATA}/bible/free-text-search/one-version/get-verses/expected.json`);

// nock.recorder.rec();

describe('SEARCH errors', () => {

  describe('timeout', () => {

    let nocker;
    let initNock = (socketDelay) => {
      nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .socketDelay(socketDelay)
        .reply(200, freeTextDbtResponse);
    };

    it('should not timeout', (done) => {
      initNock(Imp.cfg.timeout.upstream - 1000);
      Imp.agent
        .get('/bible?q=For God so|so loved&versions=kjv')
        .expect(200, freeTextExpected, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should respond 408 on timeout', (done) => {
      initNock(Imp.cfg.timeout.upstream + 1000);
      Imp.agent
        .get('/bible?q=For God so|so loved&versions=kjv')
        .expect(408, (err) => {
          nocker.done();
          done(err);
        });

    });
  });

  describe('unexpected upstream response', () => {

    it('should respond 502 where upstream response is non 2XX', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .reply(418); // I'm a teapot

      Imp.agent
        .get('/bible?q=For God so|so loved&versions=kjv')
        .expect(502, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should respond 502 where upstream errors', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/search`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2';
        })
        .replyWithError();

      Imp.agent
        .get('/bible?q=For God so|so loved&versions=kjv')
        .expect(502, (err) => {
          nocker.done();
          done(err);
        });
    });

  });

  describe('bad request', () => {

    it('should respond 400 where no query is given', (done) => {
      Imp.agent
        .get('/bible?q=&versions=kjv')
        .expect(400, (err) => {
          done(err);
        });
    });

  });
});
