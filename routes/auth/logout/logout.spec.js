describe('/logout', () => {

  it('should respond 200', () => {
  });

  it('should respond 401', () => {
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
