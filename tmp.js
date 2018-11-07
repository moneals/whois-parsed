var util = require('util'),
	whois = require('whois');

var lookup = util.promisify(whois.lookup);

lookup('google.us', {}).then((data) => {
    console.log(data);
});