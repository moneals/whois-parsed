var util = require('util'),
	whois = require('whois'),
	parseRawData = require('./parse-raw-data.js');

var lookup = util.promisify(whois.lookup);

module.exports = async function(domain, options){
  //console.log('looking up whois for ' + domain);
  var rawData = await lookup(domain, options || {});
  // console.log(rawData);
  // TODO check for econnrest or bad whois data then try against stored data.
  // TODO else store new static whois data for that tld
	
	var result = {};

  if ( typeof rawData === 'object' ) {
		result = rawData.map(function(data) {
			data.data = parseRawData(data.data, domain);
			return data;
		});
	} else {
		result = {...result, ...parseRawData(rawData, domain)};
	}
  return result;
};