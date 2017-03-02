const Imp = require('../_classes/TestImports');
const jwt = require('jsonwebtoken');

const VALID_USERNAME = 'alexxx';
const VALID_PASSWORD = 'alexxx100';
const VALID_CREDENTIALS = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD
};

const user = require(`${Imp.UTDATA}/auth/login/user.json`);

describe('/login', () => {

  it('should respond 400 where no username is given', (done) => {

    Imp.agent
      .post('/login')
      .send({password: VALID_PASSWORD})
      .expect(400, (err) => {
        done(err);
      });
  });

  it('should respond 400 where username is too short', (done) => {

    Imp.agent
      .post('/login')
      .send({username: 'short', password: VALID_PASSWORD})
      .expect(400, (err) => {
        done(err);
      });
  });

  it('should respond 400 where username is too long', (done) => {

    Imp.agent
      .post('/login')
      .send({username: 'thisusernameisfarfartoolong', password: VALID_PASSWORD})
      .expect(400, (err) => {
        done(err);
      });
  });

  it('should respond 400 where username contains non alphanumeric chars', (done) => {

    Imp.agent
      .post('/login')
      .send({username: 'ale-xxx', password: VALID_PASSWORD})
      .expect(400, (err) => {
        done(err);
      });
  });


  it('should respond 400 where no password is given', (done) => {

    Imp.agent
      .post('/login')
      .send({username: VALID_USERNAME})
      .expect(400, (err) => {
        done(err);
      });
  });

  it('should respond 400 where password is too short', (done) => {

    Imp.agent
      .post('/login')
      .send({username: VALID_USERNAME, password: 'short'})
      .expect(400, (err) => {
        done(err);
      });
  });

  it('should respond 400 where password is too long', (done) => {

    Imp.agent
      .post('/login')
      .send({username: VALID_USERNAME, password: 'thispasswordisfarfartoolong'})
      .expect(400, (err) => {
        done(err);
      });
  });

  it('should respond 400 where password contains non alphanumeric chars', (done) => {

    Imp.agent
      .post('/login')
      .send({username: VALID_USERNAME, password: 'ale-xxx100'})
      .expect(400, (err) => {
        done(err);
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

  it('should reverse proxy the status code of an upstream success and set the JWT cookie', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, VALID_CREDENTIALS)
      .reply(200, user);

    Imp.agent
      .post('/login')
      .send(VALID_CREDENTIALS)
      .expect(200, (err, res) => {

        let jwtCookie = res.headers['set-cookie'][0];
        let jwtCookieRegex = '^twj=.*?; Max-Age=.*?; Path=\/; Expires=.*?; HttpOnly';
        if (res.request.protocol.includes('https')) {
          jwtCookieRegex += '; Secure$';
        }
        Imp.expect(jwtCookie).to.match(new RegExp(jwtCookieRegex));

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

        if (err) done(err);

        let token = res.headers['set-cookie'][0].split(';')[0].replace('twj=', '');

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

        nocker.done();

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
