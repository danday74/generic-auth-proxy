const _ = require('lodash');
const Promise = require('bluebird');
const config = require('../../../bibleServer.config');
const Requestor = require('./Requestor');

let BibleImports = {_, Promise, config, Requestor};

module.exports = BibleImports;
