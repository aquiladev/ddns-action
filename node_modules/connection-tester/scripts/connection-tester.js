'use strict';

var net = require('net');

var socket = new net.Socket(),
    host = process.argv[2],
    port = parseInt(process.argv[3], 10),
    connectTimeout = parseInt(process.argv[4], 10);

socket.setTimeout(connectTimeout);
socket.connect(port, host);

//if able to establish the connection, returns `true`
socket.on('connect', function () {
    socket.destroy();
    process.stdout.write('true');
});

//on connection error, returns error
socket.on('error', function (err) {
    var msg = err && err.message || 'connect ECONNREFUSED';
    socket.destroy();
    process.stdout.write(msg);
});

//on connection timeout, returns error
socket.on('timeout', function (err) {
    socket.destroy();
    process.stdout.write('socket TIMEOUT');
});
