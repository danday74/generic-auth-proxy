const Imp = require('../_classes/TestImports');
const cookie = require('cookie');

const VALID_USERNAME = 'alexxx';
const VALID_PASSWORD = 'alexxx100';
const VALID_CREDENTIALS = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD
};

const user = require(`${Imp.UTDATA}/auth/login/user.json`);

describe('/logout', () => {

  it('should respond 200 where a valid JWT token is given', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .reply(200, user);

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(200, (err) => {

        nocker.done();
        if (err) done(err);

        Imp.agent.post('/logout')
          .expect(200, (err, res) => {

            let jwtCookieStr = res.headers['set-cookie'][0];
            let jwtCookieObj = cookie.parse(jwtCookieStr);

            Imp.expect(jwtCookieObj).to.have.property('twj', '');
            Imp.expect(jwtCookieObj).to.have.property('Max-Age', '0');
            Imp.expect(jwtCookieObj).to.have.property('Path', '/');
            Imp.expect(jwtCookieObj).to.have.property('Expires');
            Imp.expect(jwtCookieObj.twj).to.be.empty;

            Imp.expect(jwtCookieStr).to.contain('HttpOnly');
            if (res.request.protocol.includes('https')) {
              Imp.expect(jwtCookieStr).to.contain('Secure');
            }

            done(err);
          });

      });
  });

  it('should respond 401 where no JWT cookie exists', (done) => {

    Imp.agent
      .get('/logout')
      .expect(401, (err) => {
        done(err);
      });
  });

  // describe('Success', () => {
  //
  //   let successObjs = [
  //     {
  //       testName: 'should respond 200 and get unclean addresses',
  //       bounce: {
  //         response: messageEventsApiBounce
  //       },
  //       events: {
  //         response: messageEventsApiEvents
  //       },
  //       expected: ['dan.lewis.web.delete@gmail.com', 'ggg@cccc.com']
  //     },
  //     {
  //       testName: 'should respond 200 with an empty list where there are no unclean addresses',
  //       bounce: {
  //         response: messageEventsApiEmpty
  //       },
  //       events: {
  //         response: messageEventsApiEmpty
  //       },
  //       expected: []
  //     }
  //   ];
  //
  //   Imp.using(successObjs, () => {
  //
  //     it('{testName}', (testObj, done) => {
  //
  //       let nocker1 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //         .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?bounce_classes=10,30,90&events=bounce,out_of_band&per_page=9999`)
  //         .reply(200, testObj.bounce.response);
  //
  //       let nocker2 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //         .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?events=generation_failure,spam_complaint,list_unsubscribe,link_unsubscribe&per_page=9999`)
  //         .reply(200, testObj.events.response);
  //
  //       Imp.agent
  //         .get('/mailer/cleanup')
  //         .expect(200, testObj.expected, (err) => {
  //           nocker1.done();
  //           nocker2.done();
  //           done(err);
  //         });
  //     });
  //
  //   });
  // });
  //
  // describe('Failure', () => {
  //
  //   let failureObjs = [
  //     {
  //       testName: 'bounce',
  //       bounce: {
  //         statusCode: 418,
  //         response: 'oops'
  //       },
  //       events: {
  //         statusCode: 200,
  //         response: messageEventsApiEvents
  //       }
  //     },
  //     {
  //       testName: 'events',
  //       bounce: {
  //         statusCode: 200,
  //         response: messageEventsApiBounce
  //       },
  //       events: {
  //         statusCode: 418,
  //         response: 'oops'
  //       }
  //     }
  //   ];
  //
  //   Imp.using(failureObjs, () => {
  //
  //     it('should respond with proxied status code where message events API {testName} response is non-2xx', (testObj, done) => {
  //
  //       let nocker1 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //         .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?bounce_classes=10,30,90&events=bounce,out_of_band&per_page=9999`)
  //         .reply(testObj.bounce.statusCode, testObj.bounce.response);
  //
  //       let nocker2 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //         .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?events=generation_failure,spam_complaint,list_unsubscribe,link_unsubscribe&per_page=9999`)
  //         .reply(testObj.events.statusCode, testObj.events.response);
  //
  //       Imp.agent
  //         .get('/mailer/cleanup')
  //         .expect(418, (err) => {
  //           nocker1.done();
  //           nocker2.done();
  //           done(err);
  //
  //         });
  //     });
  //
  //   });
  //
  //   it('should respond 500 where message events API bounce request errors', (done) => {
  //
  //     let nocker1 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?bounce_classes=10,30,90&events=bounce,out_of_band&per_page=9999`)
  //       .replyWithError('oops');
  //
  //     let nocker2 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?events=generation_failure,spam_complaint,list_unsubscribe,link_unsubscribe&per_page=9999`)
  //       .reply(200, messageEventsApiEvents);
  //
  //     Imp.agent
  //       .get('/mailer/cleanup')
  //       .expect(500, (err) => {
  //         nocker1.done();
  //         nocker2.done();
  //         done(err);
  //
  //       });
  //   });
  //
  //   it('should respond 500 where message events API events request errors', (done) => {
  //
  //     let nocker1 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?bounce_classes=10,30,90&events=bounce,out_of_band&per_page=9999`)
  //       .reply(200, messageEventsApiBounce);
  //
  //     let nocker2 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?events=generation_failure,spam_complaint,list_unsubscribe,link_unsubscribe&per_page=9999`)
  //       .replyWithError('oops');
  //
  //     Imp.agent
  //       .get('/mailer/cleanup')
  //       .expect(500, (err) => {
  //         nocker1.done();
  //         nocker2.done();
  //         done(err);
  //
  //       });
  //   });
  //
  //   it('should respond 408 where message events API bounce request times out', (done) => {
  //
  //     let nocker1 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?bounce_classes=10,30,90&events=bounce,out_of_band&per_page=9999`)
  //       .socketDelay(Imp.cfg.timeout.upstream + 1000)
  //       .reply(200, messageEventsApiBounce);
  //
  //     let nocker2 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?events=generation_failure,spam_complaint,list_unsubscribe,link_unsubscribe&per_page=9999`)
  //       .reply(200, messageEventsApiEvents);
  //
  //     Imp.agent
  //       .get('/mailer/cleanup')
  //       .expect(408, (err) => {
  //         nocker1.done();
  //         nocker2.done();
  //         done(err);
  //
  //       });
  //   });
  //
  //   it('should respond 408 where message events API events request times out', (done) => {
  //
  //     let nocker1 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?bounce_classes=10,30,90&events=bounce,out_of_band&per_page=9999`)
  //       .reply(200, messageEventsApiBounce);
  //
  //     let nocker2 = Imp.nock(Imp.cfg.nock.sparkPostUrl)
  //       .get(`${Imp.cfg.nock.sparkPostPre}/api/v1/message-events?events=generation_failure,spam_complaint,list_unsubscribe,link_unsubscribe&per_page=9999`)
  //       .socketDelay(Imp.cfg.timeout.upstream + 1000)
  //       .reply(200, messageEventsApiEvents);
  //
  //     Imp.agent
  //       .get('/mailer/cleanup')
  //       .expect(408, (err) => {
  //         nocker1.done();
  //         nocker2.done();
  //         done(err);
  //
  //       });
  //   });
  //
  // });
});
