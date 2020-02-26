connection-tester
=================

[![Build Status](https://travis-ci.org/skoranga/node-connection-tester.png)](https://travis-ci.org/skoranga/node-connection-tester)

Test to check if the connection can be established or host/port reachable for a given host and port. Useful for testing all the connection in your node application at server startup.


### How to Use

#### Async version

```javascript
const connectionTester = require('connection-tester');

connectionTester.test(
    'www.yahoo.com',  // host
    80,               // port
    1000,             // connection timeout
    (err, output) => {
        console.log(output);
    }
);

connectionTester.test(
    'api.paypal.com', // host
    443,              // port
    1000,             // connection timeout
    (err, output) => {
        console.log(output);
    }
);
```

#### Sync version

```javascript
const connectionTester = require('connection-tester');

console.log(connectionTester.test('www.yahoo.com', 80, 1000));
console.log(connectionTester.test('api.paypal.com', 443, 1000));
```
