var util = require('util'),
	whois = require('whois'),
	parseRawData = require('./parse-raw-data.js');

var lookup = util.promisify(whois.lookup);

module.exports = {
  lookup: async function(domain, options){
    //console.log('looking up whois for ' + domain);
	  var result = {};
	  try {
		  var rawData = await lookup(domain, options || {});

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
		  console.log(err);
		  throw err;
	  }


  }
};