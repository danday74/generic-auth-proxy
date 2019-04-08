const chai = require('chai')
const expect = chai.expect
const express = require('express')
const app = express()
// const config = require('../authServer.config')
const ServerCreator = require('./ServerCreator')

describe('ServerCreator', () => {

  it('should create an HTTP server', () => {
    const serverCreator = new ServerCreator(app)
    const httpServer = serverCreator.createHttpServer()
    expect(httpServer).to.not.be.undefined
  })

  /* Fails where certs do not exist in the cert directory */
  // it('should create an HTTPS server where certs exist in the cert directory', () => {
  //   let serverCreator = new ServerCreator(app)
  //   let httpsServer = serverCreator.createHttpsServer(config.certDir)
  //   expect(httpsServer).to.not.be.undefined
  // })

  // it('should fail to create an HTTPS server where certs DO NOT exist in the cert directory', () => {
  //   let serverCreator = new ServerCreator(app)
  //   let httpsServer = serverCreator.createHttpsServer('/aaahhh/monkey')
  //   expect(httpsServer).to.be.undefined
  // })

  // it('should fail to create an HTTPS server where cert directory is not given', () => {
  //   let serverCreator = new ServerCreator(app)
  //   let httpsServer = serverCreator.createHttpsServer()
  //   expect(httpsServer).to.be.undefined
  // })

})
