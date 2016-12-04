const chai = require('chai');
const expect = chai.expect;
const Logger = require('./Logger');

describe('Logger', () => {

  it('getTimestamp()', () => {
    let timestamp = Logger.getTimestamp();
    expect(timestamp).to.match(/\d\d\/\d\d\/\d\d \d\d:\d\d:\d\d/);
  });

});
