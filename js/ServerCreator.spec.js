const chai = require('chai');
const expect = chai.expect;
const express = require('express');
const app = express();
const ServerCreator = require('./ServerCreator');

describe('ServerCreator', () => {

  it('should create an HTTP server', () => {
    let serverCreator = new ServerCreator(app);
    let httpServer = serverCreator.createHttpServer();
    // noinspection BadExpressionStatementJS
    expect(httpServer).to.not.be.undefined;
  });

  /* Fails where certs do not exist in the cert directory */
  /* Fails where LETS_ENCRYPT_DOMAIN env var is not set correctly */
  it('should create an HTTPS server where certs exist in the cert directory', () => {
    const LETS_ENCRYPT_DOMAIN = process.env.LETS_ENCRYPT_DOMAIN;
    let certDir = (LETS_ENCRYPT_DOMAIN) ? `/etc/letsencrypt/live/${LETS_ENCRYPT_DOMAIN}` : undefined;
    let serverCreator = new ServerCreator(app);
    let httpsServer = serverCreator.createHttpsServer(certDir);
    // noinspection BadExpressionStatementJS
    expect(httpsServer).to.not.be.undefined;
  });

  it('should fail to create an HTTPS server where certs DO NOT exist in the cert directory', () => {
    let serverCreator = new ServerCreator(app);
    let httpsServer = serverCreator.createHttpsServer('/aaahhh/monkey');
    // noinspection BadExpressionStatementJS
    expect(httpsServer).to.be.undefined;
  });

  it('should fail to create an HTTPS server where cert directory is not given', () => {
    let serverCreator = new ServerCreator(app);
    let httpsServer = serverCreator.createHttpsServer();
    // noinspection BadExpressionStatementJS
    expect(httpsServer).to.be.undefined;
  });

});
