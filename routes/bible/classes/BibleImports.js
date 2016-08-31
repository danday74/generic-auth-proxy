const _ = require('lodash');
const BibleHelper = require('./BibleHelper');
const config = require('../../../server.config');
const Promise = require('bluebird');
const Requestor = require('./Requestor');

let BibleImports = {_, BibleHelper, config, Promise, Requestor};

module.exports = BibleImports;
