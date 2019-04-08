const badRequestObjs = require(appRoot + '/routes/_classes/badRequestObjs')
const Imp = require(appRoot + '/routes/_classes/TestImports')

describe('/mock-validate-user', () => {

  describe('Success', () => {

    it('should respond 200 where credentials are valid', done => {

      Imp.agent
        .post('/mock-validate-user')
        .send(Imp.VALID_CREDENTIALS)
        .expect(200, Imp.user, err => {
          done(err)
        })
    })
  })

  describe('Failure', () => {

    it('should respond 401 where username is non existent', done => {

      Imp.agent
        .post('/mock-validate-user')
        .send({username: 'nonexistentusername', password: Imp.VALID_PASSWORD})
        .expect(401, err => {
          done(err)
        })
    })

    it('should respond 401 where password is invalid', done => {

      Imp.agent
        .post('/mock-validate-user')
        .send({username: Imp.VALID_USERNAME, password: 'invalid'})
        .expect(401, err => {
          done(err)
        })
    })
  })

  describe('Bad request', () => {

    Imp.using(badRequestObjs, () => {

      it('should respond 400 where {testName}', (testObj, done) => {

        Imp.agent
          .post('/mock-validate-user')
          .send(testObj.credentials)
          .expect(400, err => {
            done(err)
          })
      })
    })
  })
})
