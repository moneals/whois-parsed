var util = require('util'),
	whois = require('whois'),
	parseRawData = require('./parse-raw-data.js');


var lookup = util.promisify(whois.lookup);

module.exports = async function(domain, options){

	var rawData = await lookup(domain, options || {});
	
	var result = { domainName: domain };

  if ( typeof rawData === 'object' ) {
		result = rawData.map(function(data) {
			data.data = parseRawData(data.data);
			return data;
		});
	} else {
		result = {...result, ...parseRawData(rawData)};
	}
  return result;
};