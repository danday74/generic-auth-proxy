// const Imp = require(appRoot + '/routes/_classes/TestImports');

describe('/whoami', () => {

  describe('Success', () => {

    it('should respond 200 with restricted user data where user is authorised', (done) => {
      done();
    });
  });

  // describe('Success', () => {
  //
  //   it('should respond 200 where user is authorised', (done) => {
  //
  //     let nocker = Imp.nock
  //       .post(/validate-user$/, Imp.VALID_CREDENTIALS)
  //       .reply(200, Imp.user);
  //
  //     Imp.agent
  //       .post('/login')
  //       .send(Imp.VALID_CREDENTIALS)
  //       .expect(200, (err) => {
  //
  //         nocker.done();
  //         if (err) done(err);
  //
  //         Imp.agent
  //           .get('/authenticated')
  //           .expect(200, (err) => {
  //
  //             if (err) done(err);
  //
  //             Imp.agent
  //               .post('/logout')
  //               .expect(200, (err) => {
  //                 done(err);
  //               });
  //           });
  //       });
  //   });
  //
  //   it('should proxy requests upstream where user is authorised', (done) => {
  //
  //     let nocker1 = Imp.nock
  //       .post(/validate-user$/, Imp.VALID_CREDENTIALS)
  //       .reply(200, Imp.user);
  //
  //     let nocker2 = Imp.nockUpstream
  //       .post(/anything-else$/)
  //       .reply(200);
  //
  //     Imp.agent
  //       .post('/login')
  //       .send(Imp.VALID_CREDENTIALS)
  //       .expect(200, (err) => {
  //
  //         nocker1.done();
  //         if (err) done(err);
  //
  //         Imp.agent
  //           .post('/anything-else')
  //           .expect(200, (err) => {
  //
  //             nocker2.done();
  //             if (err) done(err);
  //
  //             Imp.agent
  //               .post('/logout')
  //               .expect(200, (err) => {
  //                 done(err);
  //               });
  //           });
  //       });
  //   });
  // });
  //
  // describe('Failure', () => {
  //
  //   it('should respond 401 where user is unauthorised', (done) => {
  //
  //     Imp.agent
  //       .get('/authenticated')
  //       .expect(401, (err) => {
  //         done(err);
  //       });
  //   });
  //
  //   it('should respond 401 where JWT cookie is invalid', (done) => {
  //
  //     let jwtInvalidCookie = Imp.cookie.serialize(Imp.cfg.jwt.cookieName, 'invalid');
  //
  //     let nocker = Imp.nock
  //       .post(/validate-user$/, Imp.VALID_CREDENTIALS)
  //       .reply(200, Imp.user);
  //
  //     Imp.agent
  //       .post('/login')
  //       .send(Imp.VALID_CREDENTIALS)
  //       .expect(200, (err) => {
  //
  //         nocker.done();
  //         if (err) done(err);
  //
  //         Imp.agent
  //           .get('/authenticated')
  //           .set('Cookie', jwtInvalidCookie)
  //           .expect(401, (err) => {
  //             done(err);
  //           });
  //       });
  //   });
  // });
});
