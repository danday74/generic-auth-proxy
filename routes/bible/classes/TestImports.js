const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const server = require('../../../server');
const agent = supertest.agent(server);
const nock = require('nock');
const using = require('data-driven');
const cfg = require('../../../server.config.js');
const dbtSearchResponseNoResults = [[{'total_results': '0'}], []];

let TestImports = {expect, agent, nock, using, cfg, dbtSearchResponseNoResults};

module.exports = TestImports;
