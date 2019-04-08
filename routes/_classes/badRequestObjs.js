const Imp = require('./TestImports')

const badRequestObjs = [
  {
    testName: 'no username is given',
    credentials: {password: Imp.VALID_PASSWORD}
  },
  {
    testName: 'username is too short',
    credentials: {username: 'short', password: Imp.VALID_PASSWORD}
  },
  {
    testName: 'username is too long',
    credentials: {username: 'thisusernameisfarfartoolong', password: Imp.VALID_PASSWORD}
  },
  {
    testName: 'username contains non alphanumeric chars',
    credentials: {username: 'ale-xxx', password: Imp.VALID_PASSWORD}
  },
  {
    testName: 'no password is given',
    credentials: {username: Imp.VALID_USERNAME}
  },
  {
    testName: 'password is too short',
    credentials: {username: Imp.VALID_USERNAME, password: 'short'}
  },
  {
    testName: 'password is too long',
    credentials: {username: Imp.VALID_USERNAME, password: 'thispasswordisfarfartoolong'}
  },
  {
    testName: 'password contains non alphanumeric chars',
    credentials: {username: Imp.VALID_USERNAME, password: 'ale-xxx100'}
  }
]

module.exports = badRequestObjs
