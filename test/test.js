const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const assert = chai.assert;
var whoisParser = require('../index');

function randomString(length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

describe('#whoisParser', function() {
    it('google.com should not be available', async function() {
        var result = await whoisParser('google.com');
        console.log(JSON.stringify(result, null, 2));
        expect(result['domainName']).to.equal('google.com');
        expect(result['isAvailable']).to.equal(false);
        assert.beforeDate(new Date(), new Date(result['expirationDate']));
        assert.afterDate(new Date(), new Date(result['creationDate']));
        assert.afterDate(new Date(), new Date(result['updatedDate']));
    });
    
    it('random .com domain should be available', async function() {
        var rString = randomString(32);
        var result = await whoisParser(rString + '.com');
        expect(result['domainName']).to.equal(rString + '.com');
        expect(result['isAvailable']).to.equal(true);
        expect(result.hasOwnProperty('creationDate')).to.be.false;
        expect(result.hasOwnProperty('updatedDate')).to.be.false;
        expect(result.hasOwnProperty('expirationDate')).to.be.false;

    });
});