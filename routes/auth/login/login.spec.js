const Imp = require('../_classes/TestImports');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const VALID_USERNAME = 'alexxx';
const VALID_PASSWORD = 'alexxx100';
const VALID_CREDENTIALS = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD
};

const user = require(`${Imp.UTDATA}/auth/login/user.json`);

describe('/login', () => {

  let credentialsObjs = [
    {
      testName: 'no username is given',
      credentials: {password: VALID_PASSWORD}
    },
    {
      testName: 'username is too short',
      credentials: {username: 'short', password: VALID_PASSWORD}
    },
    {
      testName: 'username is too long',
      credentials: {username: 'thisusernameisfarfartoolong', password: VALID_PASSWORD}
    },
    {
      testName: 'username contains non alphanumeric chars',
      credentials: {username: 'ale-xxx', password: VALID_PASSWORD}
    },
    {
      testName: 'no password is given',
      credentials: {username: VALID_USERNAME}
    },
    {
      testName: 'password is too short',
      credentials: {username: VALID_USERNAME, password: 'short'}
    },
    {
      testName: 'password is too long',
      credentials: {username: VALID_USERNAME, password: 'thispasswordisfarfartoolong'}
    },
    {
      testName: 'password contains non alphanumeric chars',
      credentials: {username: VALID_USERNAME, password: 'ale-xxx100'}
    }
  ];

  Imp.using(credentialsObjs, () => {

    it('should respond 400 where {testName}', (testObj, done) => {

      Imp.agent
        .post('/login')
        .send(testObj.credentials)
        .expect(400, (err) => {
          done(err);
        });
    });

  });

  it('should reverse proxy the status code of an upstream failure', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .reply(401);

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(401, (err) => {
        nocker.done();
        done(err);
      });
  });

  it('should handle an upstream error', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .replyWithError('oopsie');

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(500, (err) => {
        nocker.done();
        done(err);
      });
  });

  it('should handle an upstream timeout', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .socketDelay(Imp.cfg.timeout.upstream + 1000)
      .reply(200, user);

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(408, (err) => {
        nocker.done();
        done(err);
      });
  });

  it('should reverse proxy the status code of an upstream success and set the JWT cookie', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .reply(200, user);

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(200, (err, res) => {

        let jwtCookieStr = res.headers['set-cookie'][0];
        let jwtCookieObj = cookie.parse(jwtCookieStr);

        Imp.expect(jwtCookieObj).to.have.property('twj');
        Imp.expect(jwtCookieObj).to.have.property('Max-Age');
        Imp.expect(jwtCookieObj).to.have.property('Path', '/');
        Imp.expect(jwtCookieObj).to.have.property('Expires');
        Imp.expect(jwtCookieObj.twj).to.not.be.empty;

        Imp.expect(jwtCookieStr).to.contain('HttpOnly');
        if (res.request.protocol.includes('https')) {
          Imp.expect(jwtCookieStr).to.contain('Secure');
        }

        nocker.done();
        done(err);
      });
  });

  it('should decode the JWT to retrieve user data', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .reply(200, user);

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(200, (err, res) => {

        nocker.done();
        if (err) done(err);

        let jwtCookieStr = res.headers['set-cookie'][0];
        let jwtCookieObj = cookie.parse(jwtCookieStr);
        let token = jwtCookieObj.twj;

        jwt.verify(token, Imp.cfg.jwt.secret, function (err, decoded) {

          Imp.expect(decoded).to.have.property('admin', user.admin);
          Imp.expect(decoded).to.have.property('email', user.email);
          Imp.expect(decoded).to.have.property('username', user.username);
          Imp.expect(decoded).to.have.property('iat');
          Imp.expect(decoded).to.have.property('exp');

          let expiresIn = decoded.exp - decoded.iat;
          Imp.expect(expiresIn).to.eql(Imp.cfg.jwt.expiresIn);

          done(err);
        });

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
