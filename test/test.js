const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const assert = chai.assert;
const sleep = require('util').promisify(setTimeout);
var whoisParser = require('../index');

//TODO Add unit tests that use stored whois responses when hit connection reset or rate limit error
//TODO add dayfirst = True logic from pywhois

function randomString(length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function testNotAvailable (base, tld, options = {}) {
  await sleep(3000);
  var result = await whoisParser(base + tld);
  // console.log (result);
  expect(result['domainName']).to.equal(base + tld);
  expect(result['isAvailable']).to.equal(false);
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('expirationDate'))) {
    assert.beforeDate(new Date(), new Date(result['expirationDate']));
  }
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('creationDate'))) {
    assert.afterDate(new Date(), new Date(result['creationDate']));
  }
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('updatedDate'))) {
    assert.afterDate(new Date(), new Date(result['updatedDate']));
  }
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('status'))) {
    expect(result['status'].length).to.be.above(0);
  }
}

async function testAvailable (tld) {
  await sleep(3000);
  var rString = randomString(32);
  var result = await whoisParser(rString + tld);
  //console.log(result);
  expect(result['domainName']).to.equal(rString + tld);
  expect(result['isAvailable']).to.equal(true);
  expect(result.hasOwnProperty('creationDate')).to.be.false;
  expect(result.hasOwnProperty('updatedDate')).to.be.false;
  expect(result.hasOwnProperty('expirationDate')).to.be.false;
  expect(result.hasOwnProperty('status')).to.be.false;
}
    
describe('#whoisParser integration tests', function() {
    this.timeout(10000);
    it('known .com should not be available and have data', async function () {
      await testNotAvailable('google', '.com');
    });
    it('random .com domain should be available', async function() {
      await testAvailable('.com');
    });
    
    it('known .net should not be available and have data', async function () {
      await testNotAvailable('google', '.net');
    });
    it('random .net domain should be available', async function() {
      await testAvailable('.net');
    });
    
    it('known .org should not be available and have data', async function () {
      await testNotAvailable('google', '.org');
    });
    it('random .org domain should be available', async function() {
      await testAvailable('.org');
    });
    
    it('known .name should not be available and have data', async function () {
      await testNotAvailable('google', '.name', {excludedFields: ['creationDate', 'expirationDate', 'updatedDate']});
    });
    it('random .name domain should be available', async function() {
      await testAvailable('.name');
    });
    
    it('known .me should not be available and have data', async function () {
      await testNotAvailable('google', '.me');
    });
    it('random .me domain should be available', async function() {
      await testAvailable('.me');
    });
    
    // updatedDate is sometimes populated for .au domains, but not always.
    it('known .au should not be available and have data', async function () {
      await testNotAvailable('google.com', '.au', { excludedFields: ['creationDate', 'expirationDate', 'updatedDate']});
    });
    it('random .au domain should be available', async function() {
      await testAvailable('.com.au');
    });
    
    it('known .ru should not be available and have data', async function () {
      await testNotAvailable('google', '.ru', { excludedFields: ['updatedDate']});
    });
    it('random .ru domain should be available', async function() {
      await testAvailable('.ru');
    });
    
    it('known .us should not be available and have data', async function () {
      await testNotAvailable('google', '.us');
    });
    it('random .us domain should be available', async function() {
      await testAvailable('.us');
    });
    
    it('known .uk should not be available and have data', async function () {
      await testNotAvailable('google.co', '.uk', { excludedFields: ['status']});
    });
    it('random .uk domain should be available', async function() {
      await testAvailable('.co.uk');
    });
    
    it('known .fr should not be available and have data', async function () {
      await testNotAvailable('google', '.fr');
    });
    it('random .fr domain should be available', async function() {
      await testAvailable('.fr');
    });
    
    it('known .nl should not be available and have data', async function () {
      await testNotAvailable('google', '.nl', {excludedFields: ['creationDate', 'expirationDate', 'updatedDate']});
    });
    it('random .nl domain should be available', async function() {
      await testAvailable('.nl');
    });
    
    it('known .fi should not be available and have data', async function () {
      await testNotAvailable('google', '.fi');
    });
    it('random .fi domain should be available', async function() {
      await testAvailable('.fi');
    });
    
    it('known .jp should not be available and have data', async function () {
      await testNotAvailable('google', '.jp');
    });
    it('random .jp domain should be available', async function() {
      await testAvailable('.jp');
    });
});