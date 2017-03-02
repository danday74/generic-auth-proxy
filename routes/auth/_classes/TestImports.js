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
const nock = require('nock')(new RegExp(cfg.nockHost));
const using = require('data-driven');

const UTDATA = appRoot + '/utdata';

let TestImports = {
  agent,
  expect,
  sinon,
  nock,
  using,
  cfg,
  UTDATA
};

module.exports = TestImports;
