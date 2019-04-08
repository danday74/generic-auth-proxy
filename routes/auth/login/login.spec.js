const jwt = require('jsonwebtoken')
const moment = require('moment')
const badRequestObjs = require(appRoot + '/routes/_classes/badRequestObjs')
const Imp = require(appRoot + '/routes/_classes/TestImports')
const restrictedUser = require(appRoot + '/test/utdata/auth/whoami/restrictedUser.json')
const Nock = require('nock')
const cfg = require('../../../authServer.config')

describe('/login', () => {

  let nock

  beforeEach(done => {
    setTimeout(() => {
      Nock.cleanAll()
      nock = Nock(new RegExp(cfg.nockHost)) // .log(console.log)
      done()
    })
  })

  describe('Success', () => {

    it('should respond with proxied status code where upstream \'validate user\' response is 2xx and set the JWT cookie', done => {

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, restrictedUser, (err, res) => {

          nocker.done()
          if (err) done(err)

          // Check JWT cookie as expected
          const jwtCookieStr = res.headers['set-cookie'][0]
          const jwtCookieObj = Imp.cookie.parse(jwtCookieStr)

          Imp.expect(jwtCookieObj).to.have.property(Imp.cfg.jwt.cookieName)
          Imp.expect(jwtCookieObj).to.have.property('Max-Age')
          Imp.expect(jwtCookieObj).to.have.property('Path', '/')
          Imp.expect(jwtCookieObj).to.have.property('Expires')

          Imp.expect(jwtCookieObj[Imp.cfg.jwt.cookieName]).to.not.be.empty

          const maxAge = +jwtCookieObj['Max-Age']
          Imp.expect(maxAge).to.eql(Imp.cfg.jwt.expiresIn)

          const expires = moment(jwtCookieObj['Expires'])
          Imp.expect(expires.toDate()).to.be.at.least(moment().add(23, 'hours').add(59, 'minutes').toDate())
          Imp.expect(expires.toDate()).to.be.at.most(moment().add(24, 'hours').toDate())

          Imp.expect(jwtCookieStr).to.contain('HttpOnly')
          if (res.request.protocol.includes('https')) {
            Imp.expect(jwtCookieStr).to.contain('Secure')
          }

          done()
        })
    })

    it('should support decoding the JWT to retrieve user data', done => {

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, restrictedUser, (err, res) => {

          nocker.done()
          if (err) done(err)

          const jwtCookieStr = res.headers['set-cookie'][0]
          const jwtCookieObj = Imp.cookie.parse(jwtCookieStr)
          const token = jwtCookieObj[Imp.cfg.jwt.cookieName]

          jwt.verify(token, Imp.cfg.jwt.secret, (err, decoded) => {

            if (err) done(err)

            // Check decoded object as expected
            Imp.expect(decoded).to.have.property('admin', Imp.user.admin)
            Imp.expect(decoded).to.have.property('email', Imp.user.email)
            Imp.expect(decoded).to.have.property('username', Imp.user.username)
            Imp.expect(decoded).to.have.property('iat')
            Imp.expect(decoded).to.have.property('exp')

            const expiresIn = decoded.exp - decoded.iat
            Imp.expect(expiresIn).to.eql(Imp.cfg.jwt.expiresIn)

            done()
          })
        })
    })
  })

  describe('Failure', () => {

    it('should respond with proxied status code where upstream \'validate user\' response is non-2xx', done => {

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(401)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(401, err => {
          nocker.done()
          done(err)
        })
    })

    it('should respond 500 where upstream \'validate user\' request errors', done => {

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .replyWithError('oopsie')

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(500, err => {
          nocker.done()
          done(err)
        })
    })

    it('should respond 408 where upstream \'validate user\' request times out', done => {

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .socketDelay(Imp.cfg.timeout.upstream + 1000)
        .reply(200, Imp.user)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(408, err => {
          nocker.done()
          done(err)
        })
    })
  })

  describe('Bad request', () => {

    Imp.using(badRequestObjs, () => {

      it('should respond 400 where {testName}', (testObj, done) => {

        Imp.agent
          .post('/login')
          .send(testObj.credentials)
          .expect(400, err => {
            done(err)
          })
      })
    })
  })
})
