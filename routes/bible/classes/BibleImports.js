const _ = require('lodash');
const config = require('../../../server.config');
const Promise = require('bluebird');
const Requestor = require('./Requestor');

let BibleImports = {_, config, Promise, Requestor};

module.exports = BibleImports;
