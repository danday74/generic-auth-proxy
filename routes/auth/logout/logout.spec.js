const moment = require('moment');
const Imp = require(appRoot + '/routes/_classes/TestImports');

describe('/logout', () => {

  describe('Success', () => {

    it('should respond 200 where user is authorised and delete the JWT cookie', (done) => {

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
            .post('/logout')
            .expect(200, (err, res) => {

              if (err) done(err);

              // Check JWT cookie as expected
              let jwtCookieStr = res.headers['set-cookie'][0];
              let jwtCookieObj = Imp.cookie.parse(jwtCookieStr);

              Imp.expect(jwtCookieObj).to.have.property(Imp.cfg.jwt.cookieName, '');
              Imp.expect(jwtCookieObj).to.have.property('Max-Age', '0');
              Imp.expect(jwtCookieObj).to.have.property('Path', '/');
              Imp.expect(jwtCookieObj).to.have.property('Expires');

              Imp.expect(jwtCookieObj[Imp.cfg.jwt.cookieName]).to.be.empty;

              let expires = moment(jwtCookieObj.Expires);
              Imp.expect(expires).to.be.at.most(moment());

              Imp.expect(jwtCookieStr).to.contain('HttpOnly');
              if (res.request.protocol.includes('https')) {
                Imp.expect(jwtCookieStr).to.contain('Secure');
              }

              done();
            });
        });
    });
  });

  describe('Failure', () => {

    it('should respond 401 where user is unauthorised', (done) => {

      Imp.agent
        .post('/logout')
        .expect(401, (err) => {
          done(err);
        });
    });
  });
});
