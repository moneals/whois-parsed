var defaultRegex = {
    'domainName':          'Domain Name: *(.+)',
    'registrar':            'Registrar: *(.+)',
    'updatedDate':         'Updated Date: *(.+)',
    'creationDate':        'Creation Date: *(.+)',
    'expirationDate':      'Expir\\w+ Date: *(.+)',
    'status':               'Status: *(.+)'
};

var parseRawData = function(rawData, domain) {
	if (rawData == null) {
	  throw new Error('No Whois data received');
	}
	var result = {};	
	var lines = rawData.split('\n');
	
	lines.forEach(function(line){
	  line = line.trim();
	  var domainRegex = '';
	  if (domain.endsWith('.com') || domain.endsWith('.net') || domain.endsWith('.org')) {
	    domainRegex = defaultRegex;
	  } else {
	    throw new Error('TLD not supported');
	  }
		Object.keys(domainRegex).forEach(function(key) {
      var regex = new RegExp(domainRegex[key], 'i');
      if (line.match(regex)) {
        var value = line.match(regex)[line.match(regex).length-1];
        if (key === 'status') {
          if (result[key]) {
            result[key].push(value);
          } else {
            result[key] = [value];
          }
        } else {
          result[key] = value;
        }
      }
    });
	});
	//console.log(domain + ' rawdata: ' + rawData);
	if (result.hasOwnProperty('expirationDate')) {
	  result['isAvailable'] = false;
	} else {
	  result['isAvailable'] = true;
	}
	return result;
};

module.exports = parseRawData;
