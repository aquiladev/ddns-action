'use strict';

var _sockjs = require('../../external/sockjs-0.3.4');

var _sockjsClient = require('sockjs-client');

var _sockjsClient2 = _interopRequireDefault(_sockjsClient);

var _stomp = require('../../external/stomp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a connector object
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - A connector object
 */
var create = function create(endpoint, address) {
  return {
    endpoint: endpoint,
    address: address.replace(/-/g, "").toUpperCase(),
    socket: undefined,
    stompClient: undefined,
    connect: connect,
    close: close
  };
};

/**
 * Tries to establish a connection. 
 *
 * @return {promise} - A resolved or rejected promise
 */
var connect = function connect() {
  var _this = this;

  return new Promise(function (resolve, reject) {
    var self = _this;
    if (!_sockjs.SockJS) self.socket = new _sockjsClient2.default(self.endpoint.host + ':' + self.endpoint.port + '/w/messages');else self.socket = new _sockjs.SockJS(self.endpoint.host + ':' + self.endpoint.port + '/w/messages');
    self.stompClient = _stomp.Stomp.over(self.socket);
    self.stompClient.debug = false;
    self.stompClient.connect({}, function (frame) {
      resolve(true);
    }, function (err) {
      reject("Connection failed!");
    });
  });
};

/**
 * Close a connection
 */
var close = function close() {
  var self = this;
  console.log("Connection to " + self.endpoint.host + " must be closed now.");
  self.socket.close();
  self.socket.onclose = function (e) {
    console.log(e);
  };
};

module.exports = {
  create: create
};
//# sourceMappingURL=connector.js.map