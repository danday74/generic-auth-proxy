const Imp = require('../_classes/TestImports');

describe('/logout', () => {

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

        Imp.agent.post('/logout')
          .expect(200, (err, res) => {

            let jwtCookieStr = res.headers['set-cookie'][0];
            let jwtCookieObj = Imp.cookie.parse(jwtCookieStr);

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

});
