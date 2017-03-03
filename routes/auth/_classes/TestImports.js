// agent
const supertest = require('supertest');
const server = require(appRoot + '/authServer').https;
const agent = supertest.agent(server);

// expect sinon
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// require('sinon-as-promised');
const expect = chai.expect;
chai.use(sinonChai);

// others
const cfg = require(appRoot + '/authServer.config');
const cookie = require('cookie');
const nock = require('nock')(new RegExp(cfg.nockHost));
const using = require('data-driven');

const VALID_USERNAME = 'alexxx';
const VALID_PASSWORD = 'alexxx100';
const VALID_CREDENTIALS = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD
};
const user = require(appRoot + '/utdata/auth/login/user.json');

let TestImports = {
  agent,
  expect,
  sinon,
  nock,
  using,
  cfg,
  cookie,
  VALID_USERNAME,
  VALID_PASSWORD,
  VALID_CREDENTIALS,
  user
};

module.exports = TestImports;
