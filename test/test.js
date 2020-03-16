const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const assert = chai.assert;
var whoisParser = require('../index');
const punycode = require('punycode');

function randomString(length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function whoisWithRetries(domain, retriesLeft = 3, options = {}) {
    return new Promise(function(resolve, reject) {
        whoisParser.lookup(domain, options)
            .then ((results) => {
                return resolve(results);
            })
            .catch ((error) => {
                if (retriesLeft > 0 &&
                    ((error.code && error.code === 'ECONNRESET')
                        || error.message.match(/.*Bad WHOIS Data.*/)
                        || error.message.match(/.*Rate Limited*/))) {
                    console.warn('Retrying ' + domain + ' due to ' + error.message + ' error. Retries left: ' + retriesLeft);
                    whoisWithRetries(domain, retriesLeft-1, options)
                        .then((results) => {
                            return resolve(results);
                        })
                        .catch((err) => {
                            return reject(err);
                        });
                } else {
                    console.log(error);
                    return reject(error);
                }
            });
    });
}

async function testNotAvailable (base, tld, options = {}) {
  var result = await whoisWithRetries(base + tld);

  // console.log (result);
  if (tld === '.рф') { // this gets translated to puny code
    expect(punycode.toUnicode(result['domainName'])).to.equal(base + tld); 
  } else {
    expect(result['domainName']).to.equal(base + tld);
  }
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
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('registrar'))) {
    expect(result.hasOwnProperty('registrar')).to.be.true;
  }
  expect(result.hasOwnProperty('dateFormat')).to.be.false;
}

async function testAvailable (tld) {
  var rString = randomString(32).toLowerCase();
  var result = await whoisWithRetries(rString + tld);
  // console.log(result);
  expect(result['domainName']).to.equal(rString + tld);
  expect(result['isAvailable']).to.equal(true);
  expect(result.hasOwnProperty('creationDate')).to.be.false;
  expect(result.hasOwnProperty('updatedDate')).to.be.false;
  expect(result.hasOwnProperty('expirationDate')).to.be.false;
  expect(result.hasOwnProperty('registrar')).to.be.false;
  expect(result.hasOwnProperty('dateFormat')).to.be.false;
}
    
describe('#whoisParser integration tests', function() {
    this.timeout(250000);

    beforeEach(() => {
        // Pause 3 seconds in between requests to help prevent rate limiting
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 3000);
        });
    });

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
      await testNotAvailable('google', '.ru', {excludedFields: ['updatedDate']});
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
      await testNotAvailable('google', '.jp', {excludedFields: ['registrar']});
    });
    it('random .jp domain should be available', async function() {
      await testAvailable('.jp');
    });

    it('known .pl should not be available and have data', async function () {
      await testNotAvailable('google', '.pl', {excludedFields: ['status']});
    });
    it('random .pl domain should be available', async function() {
      await testAvailable('.pl');
    });

    it('known .br should not be available and have data', async function () {
      await testNotAvailable('google.com', '.br', {excludedFields: ['registrar']});
    });
    it('random .br domain should be available', async function() {
      await testAvailable('.com.br');
    });

    it('known .eu should not be available and have data', async function () {
      await testNotAvailable('google', '.eu', {excludedFields: ['creationDate', 'expirationDate', 'updatedDate', 'status']});
    });
    it('random .eu domain should be available', async function() {
      await testAvailable('.eu');
    });

    it('known .ee should not be available and have data', async function () {
      await testNotAvailable('google', '.ee');
    });
    it('random .ee domain should be available', async function() {
      await testAvailable('.ee');
    });

    it('known .kr should not be available and have data', async function () {
      await testNotAvailable('google', '.kr', {excludedFields: ['status']});
    });
    it('random .kr domain should be available', async function() {
      await testAvailable('.kr');
    });

    it('known .bg should not be available and have data', async function () {
      await testNotAvailable('google', '.bg', {excludedFields: ['creationDate', 'expirationDate', 'updatedDate', 'registrar']});
    });
    it('random .bg domain should be available', async function() {
      await testAvailable('.bg');
    });

    it('known .de should not be available and have data', async function () {
      await testNotAvailable('google', '.de', {excludedFields: ['creationDate', 'expirationDate', 'registrar']});
    });
    it('random .de domain should be available', async function() {
      await testAvailable('.de');
    });

    it('known .at should not be available and have data', async function () {
      await testNotAvailable('google', '.at', {excludedFields: ['creationDate', 'expirationDate', 'status']});
    });
    it('random .at domain should be available', async function() {
      await testAvailable('.at');
    });

    it('known .ca should not be available and have data', async function () {
      await testNotAvailable('google', '.ca');
    });
    it('random .ca domain should be available', async function() {
      await testAvailable('.ca');
    });

    it('known .be should not be available and have data', async function () {
      await testNotAvailable('google', '.be', {excludedFields: ['updatedDate', 'expirationDate']});
    });
    it('random .be domain should be available', async function() {
      await testAvailable('.be');
    });

    it('known .рф should not be available and have data', async function () {
      await testNotAvailable('президент', '.рф', {excludedFields: ['updatedDate']});
    });
    it('random .рф domain should be available', async function() {
      await testAvailable('.рф');
    });

    it('known .info should not be available and have data', async function () {
      await testNotAvailable('google', '.info');
    });
    it('random .info domain should be available', async function() {
      await testAvailable('.info');
    });

    it('known .su should not be available and have data', async function () {
      await testNotAvailable('google', '.su', {excludedFields: ['updatedDate']});
    });
    it('random .su domain should be available', async function() {
      await testAvailable('.su');
    });

    it('known .kg should not be available and have data', async function () {
      await testNotAvailable('google', '.kg', {excludedFields: ['status']});
    });
    it('random .kg domain should be available', async function() {
      await testAvailable('.kg');
    });

    it('known .biz should not be available and have data', async function () {
      await testNotAvailable('google', '.biz');
    });
    it('random .biz domain should be available', async function() {
      await testAvailable('.biz');
    });

    it('known .mobi should not be available and have data', async function () {
      await testNotAvailable('google', '.mobi');
    });
    it('random .mobi domain should be available', async function() {
      await testAvailable('.mobi');
    });

    it('known .id should not be available and have data', async function () {
      await testNotAvailable('google', '.id');
    });
    it('random .id domain should be available', async function() {
      await testAvailable('.id');
    });

    it('known .sk should not be available and have data', async function () {
      await testNotAvailable('google', '.sk');
    });
    it('random .sk domain should be available', async function() {
      await testAvailable('.sk');
    });

    it('known .se should not be available and have data', async function () {
      await testNotAvailable('google', '.se');
    });
    it('random .se domain should be available', async function() {
      await testAvailable('.se');
    });

    it('known .nu should not be available and have data', async function () {
      await testNotAvailable('google', '.nu');
    });
    it('random .se domain should be available', async function() {
      await testAvailable('.se');
    });

    it('known .is should not be available and have data', async function () {
      await testNotAvailable('google', '.is', {excludedFields: ['updatedDate', 'status', 'registrar']});
    });
    it('random .is domain should be available', async function() {
      await testAvailable('.is');
    });

    it('known generic tld domain (.bike) should not be available and have data', async function () {
        await testNotAvailable('red', '.bike', {excludedFields: ['status']});
    });
    it('random generic tld domain (.bike) should be available', async function() {
        await testAvailable('.bike');
    });
    it('known generic tld domain (.asia) should not be available and have data', async function () {
        await testNotAvailable('google', '.asia', {excludedFields: ['status']} );
    });
    it('random generic tld domain (.asia) should be available', async function() {
        await testAvailable('.asia');
    });
    it('known generic tld domain (.io) should not be available and have data', async function () {
        await testNotAvailable('facebook', '.io', {excludedFields: ['status']} );
    });
    it('random generic tld domain (.io) should be available', async function() {
        await testAvailable('.io');
    });
    it('known .co should not be available and have data', async function () {
      await testNotAvailable('google', '.co');
    });
    it('random .co domain should be available', async function() {
      await testAvailable('.co');
    });

    it('random tld domain should throw TLD not supported error', () => {
        return whoisWithRetries('google.sdiekdsoclsld')
            .then(
                () => Promise.reject(new Error('Expected call to reject.')),
                err => {
                    assert.instanceOf(err, Error);
                    assert.equal(err.message, 'TLD not supported');
                }
            );
    });

    it('domains with multiple status values should list all statuses', async function () {
      var result = await whoisWithRetries('google.com');
      expect(result['domainName']).to.equal('google.com');
      expect(result['isAvailable']).to.equal(false);
      assert.beforeDate(new Date(), new Date(result['expirationDate']));
      assert.afterDate(new Date(), new Date(result['creationDate']));
      assert.afterDate(new Date(), new Date(result['updatedDate']));
      expect(result['status'].length).to.be.above(2);
      expect(result.hasOwnProperty('registrar')).to.be.true;
      expect(result.hasOwnProperty('dateFormat')).to.be.false;
    });

	it('domains with a broken registrar link should work', async function () {
		var result = await whoisWithRetries('st-andrews-school.org');
		expect(result['domainName']).to.equal('st-andrews-school.org');
		expect(result['isAvailable']).to.equal(false);
		assert.beforeDate(new Date(), new Date(result['expirationDate']));
		assert.afterDate(new Date(), new Date(result['creationDate']));
		assert.afterDate(new Date(), new Date(result['updatedDate']));
		expect(result['status'].length).to.be.above(0);
		expect(result.hasOwnProperty('registrar')).to.be.true;
		expect(result.hasOwnProperty('dateFormat')).to.be.false;
	});

    //TODO call something like https://api.getproxylist.com/proxy?lastTested=300&protocol[]=socks5 to test proxy
    it('proxy should work', async function () {
        var whoisOptions = {
            proxy: {
                host: '118.190.206.86',
                port: 9999,
                // userId: "optional",
                // password: "optional",
                type: 5,
            },
            timeout: 30000,
        };

        var result = await whoisWithRetries('google.com', 3, whoisOptions);
        expect(result['domainName']).to.equal('google.com');
        expect(result['isAvailable']).to.equal(false);
        assert.beforeDate(new Date(), new Date(result['expirationDate']));
        assert.afterDate(new Date(), new Date(result['creationDate']));
        assert.afterDate(new Date(), new Date(result['updatedDate']));
        expect(result['status'].length).to.be.above(0);
        expect(result.hasOwnProperty('registrar')).to.be.true;
        expect(result.hasOwnProperty('dateFormat')).to.be.false;
    });
});