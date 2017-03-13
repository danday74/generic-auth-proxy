const cfg = require(appRoot + '/authServer.config');

// agent
const supertest = require('supertest');
const server = require(appRoot + '/authServer').https;
const agent = supertest.agent(server);

// expect
const chai = require('chai');
const expect = chai.expect;

// 3rd party
const cookie = require('cookie');
const nock = require('nock')(new RegExp(cfg.nockHost));
const nockUpstream = require('nock')(new RegExp(cfg.upstream.split(':')[1].replace('//', '')));
const using = require('data-driven');

// custom
const user = require(appRoot + '/test/utdata/auth/login/user.json');
const VALID_USERNAME = 'alexxx';
const VALID_PASSWORD = 'alexxx100';
const VALID_CREDENTIALS = {
  username: VALID_USERNAME,
  password: VALID_PASSWORD
};

let TestImports = {
  cfg,
  agent,
  expect,
  cookie,
  nock,
  nockUpstream,
  using,
  user,
  VALID_USERNAME,
  VALID_PASSWORD,
  VALID_CREDENTIALS
};

module.exports = TestImports;
