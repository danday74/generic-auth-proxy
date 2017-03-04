// agent
const supertest = require('supertest');
const server = require(appRoot + '/authServer').http;
const agent = supertest.agent(server);

// expect
const chai = require('chai');
const expect = chai.expect;

// others
const cfg = require(appRoot + '/authServer.config');
const cookie = require('cookie');
const nock = require('nock')(new RegExp(cfg.nockHost));
const user = require(appRoot + '/test/utdata/auth/login/user.json');
const using = require('data-driven');

const VALID_USERNAME = 'alexxx';
const VALID_PASSWORD = 'alexxx100';
const VALID_CREDENTIALS = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD
};

let TestImports = {
  agent,
  expect,
  cfg,
  cookie,
  nock,
  user,
  using,
  VALID_USERNAME,
  VALID_PASSWORD,
  VALID_CREDENTIALS
};

module.exports = TestImports;
