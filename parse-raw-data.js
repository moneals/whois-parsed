var defaultRegex = {
  'domainName':          'Domain Name: *(.+)',
  'registrar':            'Registrar: *(.+)',
  'updatedDate':         'Updated Date: *(.+)',
  'creationDate':        'Creation Date: *(.+)',
  'expirationDate':      'Expir\\w+ Date: *(.+)',
  'status':               'Status: *(.+)'
};

var auRegex = {
    'domainName':                    'Domain Name: *(.+)',
    'updatedDate':			      'Last Modified: *(.+)',
    'registrar':                      'Registrar Name: *(.+)',
    'status':                         'Status: *(.+)',
    'rateLimited':                    'WHOIS LIMIT EXCEEDED'
};

var usRegex = {
  'domainName':                    'Domain Name: *(.+)',
  'registrar':                      'Sponsoring Registrar: *(.+)',
  'status':                         'Domain Status: *(.+)',
  'creationDate':                  'Creation Date: *(.+)',
  'expirationDate':                'Registry Expiry Date: *(.+)',
  'updatedDate':                   'Updated Date: *(.+)',
};

var ruRegex = {
    'domainName': 'domain: *(.+)',
    'registrar': 'registrar: *(.+)',
    'creationDate': 'created: *(.+)',
    'expirationDate': 'paid-till: *(.+)',
    'status': 'state: *(.+)'
};

var parseRawData = function(rawData, domain) {
	if (rawData == null) {
	  throw new Error('No Whois data received');
	}
	var result = {domainName: domain };	
	var lines = rawData.split('\n');
	
	var domainRegex = '';
  if (domain.endsWith('.com') || domain.endsWith('.net') || domain.endsWith('.org') 
  || domain.endsWith('.name') || domain.endsWith('.me')) {
    domainRegex = defaultRegex;
  } else if (domain.endsWith('.au')) {
    domainRegex = auRegex;
    console.log(rawData);
  } else if (domain.endsWith('.ru')) {
    domainRegex = ruRegex;
  } else if (domain.endsWith('.us')) {
    domainRegex = usRegex;
  } else {
    throw new Error('TLD not supported');
  }
	
	lines.forEach(function(line){
	  line = line.trim();
		Object.keys(domainRegex).forEach(function(key) {
      var regex = new RegExp(domainRegex[key], 'i');
      if (line.match(regex)) {
        if (key === 'rateLimited') {
          throw new Error('Rate Limited');
        } else {
          var value = line.match(regex)[line.match(regex).length-1];
          if (key === 'status') {
            if (result[key]) {
              result[key].push(value);
            } else {
              result[key] = [value];
            }
          } else if (key === 'domainName') {
            result[key] = value.toLowerCase();
          } else {
            result[key] = value;
          }
        }
      }
    });
	});
	if (result.hasOwnProperty('status') && result.status.length >= 1) {
	  result['isAvailable'] = false;
	} else {
	  result['isAvailable'] = true;
	}
// 	console.log(rawData);
// 	console.log(result);
	return result;
};

module.exports = parseRawData;
