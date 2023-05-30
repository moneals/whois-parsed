var util = require('util'),
	whois = require('whois-raw'),
	parseRawData = require('./parse-raw-data.js');

var lookup = util.promisify(whois.lookup);

module.exports = {
  lookup: async function(domain, options = {}) {
		// Where possible don't follow the detailed results to improve efficiency
	  if (options && !options.hasOwnProperty('follow')) {
		  if (domain.endsWith('.org') ||
			    domain.endsWith('.net') ||
			    domain.endsWith('.com')) {
		  	options['follow'] = 0
		  }
	  }
    //console.log('looking up whois for ' + domain);
	  var result = {};
	  try {
		  var rawData = await lookup(domain, options || {});
		  // console.log('DEBUG: raw data: ' + rawData)

		  if ( typeof rawData === 'object' ) {
			  result = rawData.map(function(data) {
				  data.data = parseRawData(data.data, domain);
				  return data;
			  });
		  } else {
			  result = {...result, ...parseRawData(rawData, domain)};
		  }
		  return result;
	  } catch(err){
		  //console.log(err);
		  throw err;
	  }


  }
};
