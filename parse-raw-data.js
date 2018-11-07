var defaultRegex = {
  'domainName':          'Domain Name: *(.+)',
  'registrar':            'Registrar: *(.+)',
  'updatedDate':         'Updated Date: *(.+)',
  'creationDate':        'Creation Date: *(.+)',
  'expirationDate':      'Expir\\w+ Date: *(.+)',
  'status':               'Status: *(.+)',
  'notFound':             '^No match for '
};

var orgRegex = {
  'domainName':          'Domain Name: *(.+)',
  'registrar':            'Registrar: *(.+)',
  'updatedDate':         'Updated Date: *(.+)',
  'creationDate':        'Creation Date: *(.+)',
  'expirationDate':      'Expir\\w+ Date: *(.+)',
  'status':               'Status: *(.+)',
  'notFound':             '^NOT FOUND'
};

var meRegex = {
  'domainName':          'Domain Name: *(.+)',
  'registrar':            'Registrar: *(.+)',
  'updatedDate':         'Updated Date: *(.+)',
  'creationDate':        'Creation Date: *(.+)',
  'expirationDate':      'Expir\\w+ Date: *(.+)',
  'status':               'Status: *(.+)',
  'notFound':             '^NOT FOUND'
};

var auRegex = {
    'domainName':                    'Domain Name: *(.+)',
    'updatedDate':			      'Last Modified: *(.+)',
    'registrar':                      'Registrar Name: *(.+)',
    'status':                         'Status: *(.+)',
    'rateLimited':                    'WHOIS LIMIT EXCEEDED',
    'notFound':                       '^NOT FOUND'
};

var usRegex = {
  'domainName':                    'Domain Name: *(.+)',
  'registrar':                      'Sponsoring Registrar: *(.+)',
  'status':                         'Domain Status: *(.+)',
  'creationDate':                  'Creation Date: *(.+)',
  'expirationDate':                'Registry Expiry Date: *(.+)',
  'updatedDate':                   'Updated Date: *(.+)',
  'notFound':                      '^No Data Found'
};

var ruRegex = {
    'domainName': 'domain: *(.+)',
    'registrar': 'registrar: *(.+)',
    'creationDate': 'created: *(.+)',
    'expirationDate': 'paid-till: *(.+)',
    'status': 'state: *(.+)',
    'notFound': 'No entries found'
};

var ukRegex = {
    'domainName':                    'Domain name:\\s*(.+)',
    'registrar':                      'Registrar:\\s*(.+)',
    'status':                         'Registration status:\\s*(.+)',
    'creationDate':                  'Registered on:\\s*(.+)',
    'expirationDate':                'Expiry date:\\s*(.+)',
    'updatedDate':                   'Last updated:\\s*(.+)',
    'notFound':                       'No match for '
};

var parseRawData = function(rawData, domain) {
	if (rawData == null) {
	  throw new Error('No Whois data received');
	}
	var result = {domainName: domain };	
	var lines = rawData.split('\n');
	
	var domainRegex = '';
  if (domain.endsWith('.com') || domain.endsWith('.net') || domain.endsWith('.name')) {
    domainRegex = defaultRegex;
  } else if (domain.endsWith('.org')) {
    domainRegex = orgRegex;
  } else if (domain.endsWith('.me')) {
    domainRegex = meRegex;
  } else if (domain.endsWith('.au')) {
    domainRegex = auRegex;
  } else if (domain.endsWith('.ru')) {
    domainRegex = ruRegex;
  } else if (domain.endsWith('.us')) {
    domainRegex = usRegex;
  } else if (domain.endsWith('.uk')) {
    domainRegex = ukRegex;
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
        } if (key === 'notFound') {
          // check if value set first to avoid false positives from quirky WHOIS data
          if (!result.hasOwnProperty('isAvailable')) {
              result['isAvailable'] = true;
            }
        } else {
          var value = line.match(regex)[line.match(regex).length-1];
          if (key === 'status') {
            // Set isAvailable to false based on a status being found
            if (!result.hasOwnProperty('isAvailable')) {
              result['isAvailable'] = false;
            }
            if (result[key]) {
              result[key].push(value);
            } else {
              result[key] = [value];
            }
          } else if (key === 'expirationDate') {
            // Set isAvailable to false based on having expiration date
            if (!result.hasOwnProperty('isAvailable')) {
              result['isAvailable'] = false;
            }
            result[key] = value;
          } else if (key === 'domainName') {
            result[key] = value.toLowerCase();
          } else {
            result[key] = value;
          }
        }
      }
    });
	});
	//console.log('result ' + JSON.stringify(result));
	if (!result.hasOwnProperty('isAvailable')) {
	  throw new Error('Bad WHOIS Data: "' + rawData + '"');
	}
  //console.log(rawData);
	return result;
};

module.exports = parseRawData;
