const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';
const chapterDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-chapter/dbt.json`);
const chapterExpected = require(`${UTDATA}/bible/verse/one-version/get-chapter/expected.json`);

// nock.recorder.rec();

describe('VERSE errors', () => {

  describe('timeout', () => {

    let nocker;
    let initNock = (socketDelay) => {
      nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .socketDelay(socketDelay)
        .reply(200, chapterDbtResponse);
    };

    it('should not timeout', (done) => {
      initNock(Imp.cfg.timeout.upstream - 1000);
      Imp.agent
        .get('/bible?q=Psalms 117&versions=kjv')
        .expect(200, chapterExpected, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should respond 408 on timeout', (done) => {
      initNock(Imp.cfg.timeout.upstream + 1000);
      Imp.agent
        .get('/bible?q=Psalms 117&versions=kjv')
        .expect(408, (err) => {
          nocker.done();
          done(err);
        });

    });
  });

  describe('unexpected upstream response', () => {

    it('should respond 502 where upstream response is non 2XX', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .reply(418); // I'm a teapot

      Imp.agent
        .get('/bible?q=Psalms 117&versions=kjv')
        .expect(502, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should respond 502 where upstream errors', (done) => {

      let nocker = Imp.nock(Imp.cfg.nock.url)
        .get(`${Imp.cfg.nock.pre}/text/verse`)
        .query((query) => {
          return query['dam_id'] === 'ENGKJVO2ET';
        })
        .replyWithError();

      Imp.agent
        .get('/bible?q=Psalms 117&versions=kjv')
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
