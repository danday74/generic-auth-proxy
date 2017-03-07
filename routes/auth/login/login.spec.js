const jwt = require('jsonwebtoken');
const badRequestObjs = require(appRoot + '/routes/_classes/badRequestObjs');
const Imp = require(appRoot + '/routes/_classes/TestImports');

describe('/login', () => {

  describe('Success', () => {

    it('should respond with proxied status code where upstream \'validate user\' response is 2xx and set the JWT cookie', (done) => {

      let nocker = Imp.nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user);

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, (err, res) => {

          nocker.done();
          if (err) done(err);

          // Check JWT cookie as expected
          let jwtCookieStr = res.headers['set-cookie'][0];
          let jwtCookieObj = Imp.cookie.parse(jwtCookieStr);

          Imp.expect(jwtCookieObj).to.have.property(Imp.cfg.jwt.cookieName);
          Imp.expect(jwtCookieObj).to.have.property('Max-Age');
          Imp.expect(jwtCookieObj).to.have.property('Path', '/');
          Imp.expect(jwtCookieObj).to.have.property('Expires');
          Imp.expect(jwtCookieObj[Imp.cfg.jwt.cookieName]).to.not.be.empty;

          Imp.expect(jwtCookieStr).to.contain('HttpOnly');
          if (res.request.protocol.includes('https')) {
            Imp.expect(jwtCookieStr).to.contain('Secure');
          }

          done();
        });
    });

    it('should support decoding the JWT to retrieve user data', (done) => {

      let nocker = Imp.nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user);

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, (err, res) => {

          nocker.done();
          if (err) done(err);

          let jwtCookieStr = res.headers['set-cookie'][0];
          let jwtCookieObj = Imp.cookie.parse(jwtCookieStr);
          let token = jwtCookieObj[Imp.cfg.jwt.cookieName];

          jwt.verify(token, Imp.cfg.jwt.secret, (err, decoded) => {

            if (err) done(err);

            // Check decoded object as expected
            Imp.expect(decoded).to.have.property('admin', Imp.user.admin);
            Imp.expect(decoded).to.have.property('email', Imp.user.email);
            Imp.expect(decoded).to.have.property('username', Imp.user.username);
            Imp.expect(decoded).to.have.property('iat');
            Imp.expect(decoded).to.have.property('exp');

            let expiresIn = decoded.exp - decoded.iat;
            Imp.expect(expiresIn).to.eql(Imp.cfg.jwt.expiresIn);

            done();
          });
        });
    });
  });

  describe('Failure', () => {

    it('should respond with proxied status code where \'validate user\' response is non-2xx', (done) => {

      let nocker = Imp.nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(401);

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(401, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should respond 500 where \'validate user\' request errors', (done) => {

      let nocker = Imp.nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .replyWithError('oopsie');

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(500, (err) => {
          nocker.done();
          done(err);
        });
    });

    it('should respond 408 where \'validate user\' request times out', (done) => {

      let nocker = Imp.nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .socketDelay(Imp.cfg.timeout.upstream + 1000)
        .reply(200, Imp.user);

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(408, (err) => {
          nocker.done();
          done(err);
        });
    });
  });

  describe('Bad request', () => {

    Imp.using(badRequestObjs, () => {

      it('should respond 400 where {testName}', (testObj, done) => {

        Imp.agent
          .post('/login')
          .send(testObj.credentials)
          .expect(400, (err) => {
            done(err);
          });
      });
    });
  });
});
