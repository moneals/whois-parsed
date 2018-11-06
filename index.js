var util = require('util'),
	whois = require('whois'),
	parseRawData = require('./parse-raw-data.js');

var lookup = util.promisify(whois.lookup);

module.exports = async function(domain, options){
  var rawData = await lookup(domain, options || {});
  //console.log(domain + ' rawData:\n' + rawData);
	
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