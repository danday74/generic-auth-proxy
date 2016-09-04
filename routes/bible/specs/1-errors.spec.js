const Imp = require('../classes/TestImports');
const UTDATA = '../../../utdata';

const searchDbtResponse = require(`${UTDATA}/bible/search/one-version/get-verses/dbt.json`);
const searchExpected = require(`${UTDATA}/bible/search/one-version/get-verses/expected.json`);
const verseDbtResponse = require(`${UTDATA}/bible/verse/one-version/get-chapter/dbt.json`);
const verseExpected = require(`${UTDATA}/bible/verse/one-version/get-chapter/expected.json`);

let usings = [
  {
    testName: 'SEARCH',
    path: '/bible?q=For God so|so loved&versions=kjv',
    nock: {
      path: '/text/search',
      damId: 'ENGKJVO2',
      response: searchDbtResponse
    },
    expected: searchExpected
  },
  {
    testName: 'VERSE',
    path: '/bible?q=Psalms 117&versions=kjv',
    nock: {
      path: '/text/verse',
      damId: 'ENGKJVO2ET',
      response: verseDbtResponse
    },
    expected: verseExpected
  }
];

// nock.recorder.rec();

describe('errors', () => {

  describe('timeout', () => {

    Imp.using(usings, () => {

      let nocker;
      let initNock = (socketDelay, nockObj) => {
        nocker = Imp.nock(Imp.cfg.nock.url)
          .get(`${Imp.cfg.nock.pre}${nockObj.path}`)
          .query((query) => {
            return query['dam_id'] === nockObj.damId;
          })
          .socketDelay(socketDelay)
          .reply(200, nockObj.response);
      };

      it('{testName} should not timeout', (testObj, done) => {
        initNock(Imp.cfg.timeout.upstream - 1000, testObj.nock);
        Imp.agent
          .get(testObj.path)
          .expect(200, testObj.expected, (err) => {
            nocker.done();
            done(err);
          });
      });

      it('{testName} should respond 408 on timeout', (testObj, done) => {
        initNock(Imp.cfg.timeout.upstream + 1000, testObj.nock);
        Imp.agent
          .get(testObj.path)
          .expect(408, (err) => {
            nocker.done();
            done(err);
          });

      });
    });
  });

  describe('unexpected upstream response', () => {

    Imp.using(usings, () => {

      it('{testName} should respond 502 where upstream response is non 2XX', (testObj, done) => {

        let nocker = Imp.nock(Imp.cfg.nock.url)
          .get(`${Imp.cfg.nock.pre}${testObj.nock.path}`)
          .query((query) => {
            return query['dam_id'] === testObj.nock.damId;
          })
          .reply(418); // I'm a teapot

        Imp.agent
          .get(testObj.path)
          .expect(502, (err) => {
            nocker.done();
            done(err);
          });
      });

      it('{testName} should respond 502 where upstream errors', (testObj, done) => {

        let nocker = Imp.nock(Imp.cfg.nock.url)
          .get(`${Imp.cfg.nock.pre}${testObj.nock.path}`)
          .query((query) => {
            return query['dam_id'] === testObj.nock.damId;
          })
          .replyWithError();

        Imp.agent
          .get(testObj.path)
          .expect(502, (err) => {
            nocker.done();
            done(err);
          });

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
