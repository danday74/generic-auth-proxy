const Imp = require('../_classes/TestImports');

describe('/authenticated', () => {

  it('should respond 401 where an invalid JWT token is given', (done) => {

    let nocker = Imp.nock
      .post(/validate-user$/, Imp.VALID_CREDENTIALS)
      .reply(200, Imp.user);

    Imp.agent
      .post('/login')
      .send(Imp.VALID_CREDENTIALS)
      .expect(200, (err) => {

        nocker.done();
        if (err) done(err);

        let jwtBrokenCookie = Imp.cookie.serialize(Imp.cfg.jwt.cookieName, 'invalid');

        Imp.agent
          .get('/authenticated')
          .set('Cookie', jwtBrokenCookie)
          .expect(401, (err) => {
            done(err);
          });

      });
  });

  it('should respond 200 where a valid JWT token is given', (done) => {

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
          .get('/authenticated')
          .expect(200, (err) => {
            done(err);
          });

      });
  });

  it('should respond 401 where no JWT cookie exists', (done) => {

    Imp.agent
      .post('/logout')
      .expect(200, (err) => {
        if (err) done(err);

        Imp.agent
          .get('/authenticated')
          .expect(401, (err) => {
            done(err);
          });

      });
  });
});
