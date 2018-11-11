var moment = require('moment');

var defaultRegex = {
  'domainName':          'Domain Name: *(.+)',
  'registrar':            'Registrar: *(.+)',
  'updatedDate':         'Updated Date: *(.+)',
  'creationDate':        'Creation Date: *(.+)',
  'expirationDate':      'Expir\\w+ Date: *(.+)',
  'status':               'Status: *(.+)',
  'notFound':             'No match for '
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
  'registrar':                      'Registrar: *(.+)',
  'status':                         'Domain Status: *(.+)',
  'creationDate':                  'Creation Date: *(.+)',
  'expirationDate':                'Registry Expiry Date: *(.+)',
  'updatedDate':                   'Updated Date: *(.+)',
  'notFound':                      '^No Data Found'
};

var ruRegex = { // and .рф .su
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
    'notFound':                       'No match for ',
    'dateFormat':                     'DD-MMM-YYYY'
};

var frRegex = {
    'domainName': 'domain: *(.+)',
    'registrar': 'registrar: *(.+)',
    'creationDate': 'created: *(.+)',
    'expirationDate': 'Expir\\w+ Date:\\s?(.+)',
    'status': 'status: *(.+)',
    'updatedDate': 'last-update: *(.+)',
    'notFound': 'No entries found in ',
    'dateFormat': 'DD/MM/YYYY'
}

var nlRegex = {
    'domainName': 'Domain Name: *(.+)',
    'registrar':  'Registrar: *\\s*(.+)',
    'status': 'Status: *(.+)',
    'notFound': '\\.nl is free',
    'rateLimited': 'maximum number of requests per second exceeded'
};

var fiRegex = {
    'domainName':                    'domain\\.*: *([\\S]+)',
    'registrar':                    'registrar\\.*: *(.*)',
    'status':                         'status\\.*: *([\\S]+)',
    'creationDate':                  'created\\.*: *([\\S]+)',
    'updatedDate':                   'modified\\.*: *([\\S]+)',
    'expirationDate':                'expires\\.*: *([\\S]+)',
    'notFound':                       'Domain not found',
    'dateFormat':                     'DD.MM.YYYY hh:mm:ss'
};

var jpRegex = {
    'domainName': '\\[Domain Name\\]\\s*(.+)',
    'creationDate': '\\[Created on\\]\\s*(.+)',
    'updatedDate':  '\\[Last Updated\\]\\s?(.+)',
    'expirationDate':  '\\[Expires on\\]\\s?(.+)',
    'status': '\\[Status\\]\\s*(.+)',
    'notFound': 'No match!!',
    'dateFormat': 'YYYY/MM/DD'
};

var plRegex = {
    'domainName':                    'DOMAIN NAME: *(.+)[\s]+$',
    'registrar':                      'REGISTRAR: *\\s*(.+)',
    'status':                         'Registration status:\\n\\s*(.+)',
    'creationDate':                  'created: *(.+)',
    'expirationDate':                'renewal date: *(.+)',
    'updatedDate':                   'last modified: *(.+)',
    'notFound':                       'No information available about domain name',
    'dateFormat':                     'YYYY.MM.DD hh:mm:ss'
};

var brRegex = {
    'domainName':                        'domain: *(.+)\n',
    'status':                        'status: *(.+)',
    'creationDate':                        'created: *(.+)',
    'expirationDate':                        'expires: *(.+)',
    'updatedDate':                        'changed: *(.+)',
    'dateFormat':                     'YYYYMMDD',
    'notFound':                       'No match for '
};

var euRegex = {
    'domainName': 'Domain: *([^\\n\\r]+)',
    'registrar': 'Registrar: *\\n *Name: *([^\\n\\r]+)',
    'notFound': 'Status: AVAILABLE'
};

var eeRegex = {
    'domainName': 'Domain: *[\\n\\r]+\s*name: *([^\\n\\r]+)',
    'status': 'Domain: *[\\n\\r]+\\s*name: *[^\\n\\r]+\\sstatus: *([^\\n\\r]+)',
    'creationDate': 'Domain: *[\\n\\r]+\\s*name: *[^\\n\\r]+\\sstatus: *[^\\n\\r]+\\sregistered: *([^\\n\\r]+)',
    'updatedDate': 'Domain: *[\\n\\r]+\\s*name: *[^\\n\\r]+\\sstatus: *[^\\n\\r]+\\sregistered: *[^\\n\\r]+\\schanged: *([^\\n\\r]+)',
    'expirationDate': 'Domain: *[\\n\\r]+\\s*name: *[^\\n\\r]+\\sstatus: *[^\\n\\r]+\\sregistered: *[^\\n\\r]+\\schanged: *[^\\n\\r]+\\sexpire: *([^\\n\\r]+)',
    'registrar': 'Registrar: *[\\n\\r]+\\s*name: *([^\\n\\r]+)',
    'notFound': 'Domain not found',
    'dateFormat': 'YYYY-MM-DD'
};

var krRegex = {
    'domainName': 'Domain Name\\s*: *(.+)',
    'creationDate': 'Registered Date\\s*: *(.+)',
    'updatedDate':  'Last updated Date\\s*: *(.+)',
    'expirationDate':  'Expiration Date\\s*: *(.+)',
    'registrar':  'Authorized Agency\\s*: *(.+)',
    'dateFormat': 'YYYY. MM. DD.',
    'notFound': 'The requested domain was not found '
};

var bgRegex = {
    'domainName': 'DOMAIN NAME: *(.+)\\n',
    'status': 'registration status: s*(.+)',
    'notFound': ' does not exist in database',
    'rateLimited': 'Query limit exceeded'
};

var deRegex = {
    'domainName': 'Domain: *(.+)',
    'status': 'Status: *(.+)',
    'updatedDate': 'Changed: *(.+)',
    'notFound': 'Status: *free'
};

var atRegex = {
    'domainName': 'domain: *(.+)',
    'updatedDate': 'changed: *(.+)',
    'registrar':  'registrar: *(.+)',
    'notFound': ' nothing found',
    'dateFormat': 'YYYYMMDD hh:mm:ss',
    'rateLimited': 'Quota exceeded'
};

var caRegex = {
    'domainName':                    'Domain name: *(.+)',
    'status':                  'Domain status: *(.+)',
    'updatedDate':                   'Updated Date: *(.+)',
    'creationDate':                  'Creation Date: *(.+)',
    'expirationDate':                'Expiry Date: *(.+)',
    'registrar':                      'Registrar: *[\\n\\r]+\\s*Name: *(.+)',
    'notFound':                       'Domain status: *available',
    'dateFormat':                     'YYYY/MM/DD'
};

var beRegex = {
    'domainName': 'Domain:\\s*(.+)',
    'registrar':                      'Registrar: *[\\n\\r]+\\s*Name:\\s*(.+)',
    'status':   'Status:\\s*(.+)',
    'creationDate':   'Registered: *(.+)',
    'dateFormat':   'ddd MMM DD YYYY',
    'notFound': 'Status:\\s*AVAILABLE'
};

var infoRegex = {
    'domainName':      'Domain Name: *(.+)',
    'registrar':        'Registrar: *(.+)',
    'updatedDate':     'Updated Date: *(.+)',
    'creationDate':    'Creation Date: *(.+)',
    'expirationDate':  'Registrar Registration Expiration Date: *(.+)',
    'status':           'Status: *(.+)',
    'notFound':         'NOT FOUND'
    //'dateFormat':       'YYYY-MM-DDTHH:mm:ssZ'
};

var kgRegex = {
    'domainName':                    '^Domain\\s*(.+)',
    'registrar':                      'Domain support: \\s*(.+)',
    'creationDate':                  'Record created:\\s*(.+)',
    'expirationDate':                'Record expires on:\\s*(.+)',
    'updatedDate':                   'Record last updated on:\\s*(.+)',
    'dateFormat':                     'ddd MMM DD HH:mm:ss YYYY',
    'notFound':                       'domain is available for registration'
};

// var chRegex = {
//     'domainName':                      '\\nDomain name:\\n*(.+)',
//     'registrar':                        'Registrar:\n*(.+)',
//     'creationDate':                    'First registration date:\\n*(.+)',
//     'rateLimited':                      'Please wait a moment and try again.',
//     'notFound':                         'We do not have an entry in our database matching your query',
//     'dateFormat':                       'YYYY-MM-DD'
// };

var idRegex = {
    'domainName':                 'Domain Name:(.+)',
    'creationDate':               'Created On:(.+)',
    'expirationDate':             'Expiration Date(.+)',
    'updatedDate':                'Last Updated On(.+)',
    'registrar':                   'Sponsoring Registrar Organization:(.+)',
    'status':                      'Status:(.+)',
    'notFound':                   'DOMAIN NOT FOUND',
    'dateFormat':                 'DD-MMM-YYYY HH:mm:ss UTC'
};

var skRegex = {
    'domainName':                  'Domain:\\s*(.+)',
    'creationDate':                 'Created:\\s*(.+)',
    'expirationDate':              'Valid Until:\\s*(.+)',
    'status':                       'EPP Status:\\s*(.+)',
    'updatedDate':                 'Updated:\\s*(.+)',
    'registrar':                  'Registrar:\\s*(.+)',
    'dateFormat':                 'YYYY-MM-DD',
    'notFound':                   'Domain not found'
};

var seRegex = {
    'domainName':                    'domain\\.*: *(.+)',
    'creationDate':                  'created\\.*: *(.+)',
    'updatedDate':                   'modified\\.*: *(.+)',
    'expirationDate':                'expires\\.*: *(.+)',
    'status':                         'status\\.*: *(.+)',
    'registrar':                      'registrar: *(.+)',
    'dateFormat':                     'YYYY-MM-DD',
    'notFound':                       '\\" not found.'
};

var isRegex = {
    'domainName':      'domain\\.*: *(.+)',
    'creationDate':    'created\\.*: *(.+)',
    'expirationDate':  'expires\\.*: *(.+)',
    'dateFormat':       'MMM DD YYYY',
    'notFound':         'No entries found for query'
};

var parseRawData = function(rawData, domain) {
	if (rawData === null) {
	  throw new Error('No Whois data received');
	} else if (rawData.length <= 10) {
    throw new Error('Bad WHOIS Data: "' + rawData + '"');
  }
	
	var result = {domainName: domain };	
	
	var domainRegex = '';
  if (domain.endsWith('.com') || domain.endsWith('.net') || domain.endsWith('.name')) {
    domainRegex = defaultRegex;
  } else if (domain.endsWith('.org') || domain.endsWith('.me') || domain.endsWith('.mobi')) {
    domainRegex = orgRegex;
  } else if (domain.endsWith('.au')) {
    domainRegex = auRegex;
  } else if (domain.endsWith('.ru') || domain.endsWith('.рф') || domain.endsWith('.su')) {
    domainRegex = ruRegex;
  } else if (domain.endsWith('.us') || domain.endsWith('.biz')) {
    domainRegex = usRegex;
  } else if (domain.endsWith('.uk')) {
    domainRegex = ukRegex;
  } else if (domain.endsWith('.fr')) {
    domainRegex = frRegex;
  } else if (domain.endsWith('.nl')) {
    domainRegex = nlRegex;
  } else if (domain.endsWith('.fi')) {
    domainRegex = fiRegex;
  } else if (domain.endsWith('.jp')) {
    domainRegex = jpRegex;
  } else if (domain.endsWith('.pl')) {
    domainRegex = plRegex;
  } else if (domain.endsWith('.br')) {
    domainRegex = brRegex;
  } else if (domain.endsWith('.eu')) {
    domainRegex = euRegex;
  } else if (domain.endsWith('.ee')) {
    domainRegex = eeRegex;
  } else if (domain.endsWith('.kr')) {
    domainRegex = krRegex;
  } else if (domain.endsWith('.bg')) {
    domainRegex = bgRegex;
  } else if (domain.endsWith('.de')) {
    domainRegex = deRegex;
  } else if (domain.endsWith('.at')) {
    domainRegex = atRegex;
  } else if (domain.endsWith('.ca')) {
    domainRegex = caRegex;
  } else if (domain.endsWith('.be')) {
    domainRegex = beRegex;
  } else if (domain.endsWith('.kg')) {
    domainRegex = kgRegex;
  } else if (domain.endsWith('.info')) {
    domainRegex = infoRegex;
  // } else if (domain.endsWith('.ch') || domain.endsWith('.li')) {
  //   domainRegex = infoRegex;
  } else if (domain.endsWith('.id')) {
    domainRegex = idRegex;
  } else if (domain.endsWith('.sk')) {
    domainRegex = skRegex;
  } else if (domain.endsWith('.se')) {
    domainRegex = seRegex;
  } else if (domain.endsWith('.is')) {
    domainRegex = isRegex;
  } else {
    throw new Error('TLD not supported');
  }
	
	Object.keys(domainRegex).forEach(function(key) {
    var regex = new RegExp(domainRegex[key], 'i');
    if (rawData.match(regex) && key !== 'dateFormat') { // dateformat not used for line matching
      if (key === 'rateLimited') {
        throw new Error('Rate Limited');
      } else if (key === 'notFound') {
        if (!result.hasOwnProperty('isAvailable')) {
            result['isAvailable'] = true;
        }
      } else {
        //var value = line.match(regex)[line.match(regex).length-1];
        var value = rawData.match(regex)[rawData.match(regex).length-1];
        if (key === 'status') {
          if (result[key]) {
            result[key].push(value);
          } else {
            result[key] = [value];
          }
        } else if (key === 'expirationDate') {
          if (domainRegex.hasOwnProperty('dateFormat')) {
            result[key] = moment(value, domainRegex.dateFormat).toJSON();
          } else {
            result[key] = moment(value).toJSON();
          }
        } else if (key === 'creationDate') {
          if (domainRegex.hasOwnProperty('dateFormat')) {
            result[key] = moment(value, domainRegex.dateFormat).toJSON();
          } else {
            result[key] = moment(value).toJSON();
          }  
        } else if (key === 'updatedDate') {
          if (domainRegex.hasOwnProperty('dateFormat')) {
            result[key] = moment(value, domainRegex.dateFormat).toJSON();
          } else {
            result[key] = moment(value).toJSON();
          }  
        } else if (key === 'domainName') {
          result[key] = value.toLowerCase();
        } else {
          result[key] = value;
        }
      }
    }
  });
	if (!result.hasOwnProperty('isAvailable')) {
	  result.isAvailable = false; 
	}
// 	console.log('rawData: "' + rawData + '"');
// 	console.log('result ' + JSON.stringify(result));
  return result;
};

module.exports = parseRawData;
