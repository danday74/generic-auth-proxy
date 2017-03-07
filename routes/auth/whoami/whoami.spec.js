const Imp = require(appRoot + '/routes/_classes/TestImports');
const restrictedUser = require(appRoot + '/test/utdata/auth/whoami/restrictedUser.json');

describe('/whoami', () => {

  describe('Success', () => {

    it('should respond 200 with a subset of user data where user is authorised', (done) => {

      let nocker = Imp.nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user);

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, (err) => {

          nocker.done();
          if (err) done(err);

          Imp.agent
            .get('/whoami')
            .expect(200, restrictedUser, (err) => {

              if (err) done(err);

              Imp.agent
                .post('/logout')
                .expect(200, (err) => {
                  done(err);
                });
            });
        });
    });
  });

  describe('Failure', () => {

    it('should respond 401 where user is unauthorised', (done) => {

      Imp.agent
        .get('/whoami')
        .expect(401, (err) => {
          done(err);
        });
    });
  });
});
