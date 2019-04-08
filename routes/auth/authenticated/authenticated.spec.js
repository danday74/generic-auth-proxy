const Imp = require(appRoot + '/routes/_classes/TestImports')
const supertest = require('supertest')
const Nock = require('nock')
const cfg = require('../../../authServer.config')

describe('/authenticated', () => {

  let nock, nockUpstream

  beforeEach(done => {
    setTimeout(() => {
      Nock.cleanAll()
      nock = Nock(new RegExp(cfg.nockHost)) // .log(console.log)
      nockUpstream = Nock(new RegExp(cfg.upstream.split(':')[1].replace('//', ''))) // .log(console.log)
      done()
    })
  })

  describe('Success', () => {

    it('should respond 200 where user is authorised', done => {

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, err => {

          nocker.done()
          if (err) done(err)

          Imp.agent
            .get('/authenticated')
            .expect(200, err => {

              if (err) done(err)

              Imp.agent
                .post('/logout')
                .expect(200, err => {
                  done(err)
                })
            })
        })
    })

    it('should reverse proxy requests upstream where user is authorised', done => {

      const nocker1 = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      const nocker2 = nockUpstream
        .post(/anything-else$/)
        .reply(200)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, err => {

          nocker1.done()
          if (err) done(err)

          Imp.agent
            .post('/anything-else')
            .expect(200, err => {

              nocker2.done()
              if (err) done(err)

              Imp.agent
                .post('/logout')
                .expect(200, err => {
                  done(err)
                })
            })
        })
    })
  })

  describe('Failure', () => {

    it('should respond 401 where user is unauthorised', done => {

      Imp.agent
        .get('/authenticated')
        .expect(401, err => {
          done(err)
        })
    })

    it('should respond 401 where JWT cookie is invalid', done => {

      const server = require(appRoot + '/authServer').http
      const agent1 = supertest.agent(server)
      const agent2 = supertest.agent(server)
      const agent3 = supertest.agent(server)

      const jwtInvalidCookie = Imp.cookie.serialize(Imp.cfg.jwt.cookieName, 'invalid')

      const nocker = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      agent1
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, (err, res) => {

          nocker.done()
          if (err) done(err)

          const jwtValidCookie = res.header['set-cookie'].toString().split(';')[0]

          agent2
            .get('/authenticated')
            .set('Cookie', jwtValidCookie)
            .expect(200, err => {

              if (err) done(err)

              agent3
                .get('/authenticated')
                .set('Cookie', jwtInvalidCookie)
                .expect(401, err => {
                  done(err)
                })
            })
        })
    })

    it('should respond 500 where user is authorised but a proxied upstream request errors', done => {

      const nocker1 = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      const nocker2 = nockUpstream
        .post(/anything-else$/)
        .replyWithError('oopsie')

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, err => {

          nocker1.done()
          if (err) done(err)

          Imp.agent
            .post('/anything-else')
            .expect(500, err => {

              nocker2.done()
              if (err) done(err)

              Imp.agent
                .post('/logout')
                .expect(200, err => {
                  done(err)
                })
            })
        })
    })

    it('should respond 504 where user is authorised but a proxied upstream request times out', done => {

      const nocker1 = nock
        .post(/validate-user$/, Imp.VALID_CREDENTIALS)
        .reply(200, Imp.user)

      const nocker2 = nockUpstream
        .post(/anything-else$/)
        .socketDelay(Imp.cfg.timeout.upstream + 1000)
        .reply(200)

      Imp.agent
        .post('/login')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, err => {

          nocker1.done()
          if (err) done(err)

          Imp.agent
            .post('/anything-else')
            .expect(504, err => {

              nocker2.done()
              if (err) done(err)

              Imp.agent
                .post('/logout')
                .expect(200, err => {
                  done(err)
                })
            })
        })
    })
  })
})
