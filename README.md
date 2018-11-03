[![Build Status](https://travis-ci.org/moneals/whois-parsed.svg?branch=master)](https://travis-ci.org/moneals/whois-parsed) [![Coverage Status](https://coveralls.io/repos/github/moneals/whois-parsed/badge.svg?branch=master)](https://coveralls.io/github/moneals/whois-parsed?branch=master)

# whois-parsed
A wrapper for the fantastic whois module that parses whois data into consistent fields across multiple tlds.

Inspiration (and regex) borrowed from the python library https://bitbucket.org/richardpenman/pywhois

## Installation

  `npm install whois-parsed`

## Usage
```
(async function(){
  const whois = require('whois-parsed/index.js');

  var results = await whois('google.com');
  console.log(JSON.stringify(results, null, 2));
})()

{
  "domainName": "google.com",
  "updatedDate": "2018-02-21T10:45:07-0800",
  "creationDate": "1997-09-15T00:00:00-0700",
  "expirationDate": "2020-09-13T21:00:00-0700",
  "registrar": "MarkMonitor, Inc.",
  "status": [
    "clientUpdateProhibited (https://www.icann.org/epp#clientUpdateProhibited)",
    "clientTransferProhibited (https://www.icann.org/epp#clientTransferProhibited)",
    "clientDeleteProhibited (https://www.icann.org/epp#clientDeleteProhibited)",
    "serverUpdateProhibited (https://www.icann.org/epp#serverUpdateProhibited)",
    "serverTransferProhibited (https://www.icann.org/epp#serverTransferProhibited)",
    "serverDeleteProhibited (https://www.icann.org/epp#serverDeleteProhibited)"
  ],
  "isAvailable": false
}
```

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
