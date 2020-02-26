'use strict';

const net = require('net');
const util = require('util');
const path = require('path');
const shell = require('child_process');

let SOCKET_TIMEOUT = 1000;   //Setting 1s as max acceptable timeout

function testSync(host, port, connectTimeout) {
    const nodeBinary = process.execPath;
    const scriptPath = path.join(__dirname, "./scripts/connection-tester");
    const cmd = util.format('"%s" "%s" %s %s %s', nodeBinary, scriptPath, host, port, connectTimeout);

    const shellOut = shell.execSync(cmd).toString();

    const output = {
        success: false,
        error: null
    };

    if (shellOut) {
      if (shellOut.match(/true/)) {
        output.success = true;
      } else {
        output.error = shellOut;
      }
    } else {
        output.error = "No output from connection test";
    }
    return output;
}

function testAsync(host, port, connectTimeout, callback) {
    const socket = new net.Socket();

    const output = {
        success: false,
        error: null
    };

    socket.connect(port, host);
    socket.setTimeout(connectTimeout);

    //if able to establish the connection, returns `true`
    socket.on('connect', function () {
        socket.destroy();
        output.success = true;
        return callback(null, output);
    });

    //on connection error, returns error
    socket.on('error', function (err) {
        socket.destroy();
        output.error = err && err.message || err;
        return callback(err, output);
    });

    //on connection timeout, returns error
    socket.on('timeout', function (err) {
        socket.destroy();
        output.error = err && err.message || err || 'socket TIMEOUT';
        return callback(err, output);
    });
}

module.exports = {

    timeout: function (socketTimeout) {

        if (!!socketTimeout) {
            SOCKET_TIMEOUT = socketTimeout;
        }

        return SOCKET_TIMEOUT;

    },
    test: function ConnectionTester(host, port, callbackOrConnectTimeout, callback) {

        // for backward compatibility
        if (typeof callbackOrConnectTimeout === 'function') {
            console.log('deprecated: Please migrate to the new interface ConnectionTester\(host, port, timeout, callback\)');
            return testAsync(host, port, SOCKET_TIMEOUT, callbackOrConnectTimeout);
        }
        if (typeof callbackOrConnectTimeout === 'number') {
            if (callback) {
                return testAsync(host, port, callbackOrConnectTimeout, callback);
            } else {
                return testSync(host, port, callbackOrConnectTimeout);
            }
        }
        if (callbackOrConnectTimeout === undefined) {
            return testSync(host, port, SOCKET_TIMEOUT);
        }
    }
};
