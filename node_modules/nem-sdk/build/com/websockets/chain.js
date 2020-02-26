'use strict';

var _sockjs = require('../../external/sockjs-0.3.4');

var _sockjsClient = require('sockjs-client');

var _sockjsClient2 = _interopRequireDefault(_sockjsClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if socket is open
 *
 * @param {object} connector - A connector object
 *
 * @return {boolean} - True if open, false otherwise
 */
var checkReadyState = function checkReadyState(connector) {
  var self = connector;
  if (_sockjs.SockJS ? self.socket.readyState !== _sockjs.SockJS.OPEN : self.socket.readyState !== _sockjsClient2.default.OPEN) {
    return false;
  }
  return true;
};

/**
 * Subscribe to the new blocks channel 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 *
 * @return the received data in the callback
 */
var subscribeNewBlocks = function subscribeNewBlocks(connector, callback) {
  var self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  self.stompClient.subscribe('/blocks', function (data) {
    callback(JSON.parse(data.body));
  });
};

/**
 * Subscribe to the new height channel
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 *
 * @return the received data in the callback
 */
var subscribeNewHeight = function subscribeNewHeight(connector, callback) {
  var self = connector;
  if (!checkReadyState(connector)) {
    return false;
  }
  self.stompClient.subscribe('/blocks/new', function (data) {
    callback(JSON.parse(data.body));
  });
};

module.exports = {
  requests: {},
  subscribe: {
    height: subscribeNewHeight,
    blocks: subscribeNewBlocks
  }
};
//# sourceMappingURL=chain.js.map