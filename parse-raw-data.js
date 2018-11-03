// const changeCase = require('change-case'),

var comRegex = {
    'domainName':          'Domain Name: *(.+)',
    'registrar':            'Registrar: *(.+)',
    'updatedDate':         'Updated Date: *(.+)',
    'creationDate':        'Creation Date: *(.+)',
    'expirationDate':      'Expir\\w+ Date: *(.+)',
    'status':               'Status: *(.+)'
};

var parseRawData = function(rawData) {
	
	var result = {};	
	var lines = rawData.split('\n');
	
	lines.forEach(function(line){
	  line = line.trim();
		//console.log(line);
		Object.keys(comRegex).forEach(function(key) {
      var regex = new RegExp(comRegex[key], 'i');
      if (line.match(regex)) {
        //console.log(line + ' matches ' + comRegex[key]);
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
	
	if (result.hasOwnProperty('expirationDate')) {
	  result['isAvailable'] = false;
	} else {
	  result['isAvailable'] = true;
	}
	return result;
};

module.exports = parseRawData;
