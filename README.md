[![Build Status](https://travis-ci.org/moneals/whois-parsed.svg?branch=master)](https://travis-ci.org/moneals/whois-parsed) [![Coverage Status](https://coveralls.io/repos/github/moneals/whois-parsed/badge.svg?branch=master)](https://coveralls.io/github/moneals/whois-parsed?branch=master)

# whois-parsed
A wrapper for the fantastic whois module that parses whois data into consistent JSON across multiple tlds. Supports proxies requiring authentication with username and password.

Inspiration (and regex) borrowed from the python library https://bitbucket.org/richardpenman/pywhois

## Installation

  `npm install whois-parsed`

## Usage
```
var whoisOptions = {
  proxy: {
    ipaddress: '111.222.33.44',
    port: 1085,
    authentication: {
        username: "youruser",
        password: "yourpassword"
    },
    type: 5
  }
};
(async function(){
  const whois = require('whois-parsed');

  var results = await whois('google.com', whoisOptions);
  console.log(JSON.stringify(results, null, 2));
})()

Output:
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

## Response Data
### domainName
Domain Name being searched.
Always populated.
### isAvailable
true if the domain name is available.
false if the domain name is currently registered.
Always populated.
### status
Array of status codes for the domain.
Always populated.
### creationDate
Date the domain was first registered for this particular registration. This date is reset when a domain expires but not when a domain registration is renewed.
Not populated for some TLDs.
### expirationDate
Date the domain registration is set to expire. This date can be extended by the registrant.
Not populated for some TLDs.
### updatedDate
Date the domain WHOIS record was last updated. Not populated for some TLDs.

## Errors

whois-parsed does not handle retry logic by design. It isn't uncommon to have whois lookups throw errors if your application gets blocked or rate limited due to too many whois calls. You should implement retry logic, rate limiting, proxies, etc. in your application as needed.

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
