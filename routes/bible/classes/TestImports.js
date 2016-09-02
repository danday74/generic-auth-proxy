const server = require('../../../server');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const agent = supertest.agent(server);
const nock = require('nock');
const cfg = require('../../../server.config.js');
const using = require('data-driven');

let TestImports = {expect, supertest, agent, nock, cfg, using};

module.exports = TestImports;
