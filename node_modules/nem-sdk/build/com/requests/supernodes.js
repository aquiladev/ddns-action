'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _nodes = require('../../model/nodes');

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets all nodes of the node reward program
 *
 * @return {array} - An array of SuperNodeInfo objects
 */
var all = function all() {
  // Configure the request
  var options = {
    url: _nodes2.default.supernodes,
    method: 'GET'
    // Send the request
  };return (0, _send2.default)(options);
};

/**
 * Gets the nearest supernodes
 *
 * @param {object} coords - A coordinates object: https://www.w3schools.com/html/html5_geolocation.asp
 *
 * @return {array} - An array of supernodeInfo objects
 */
var nearest = function nearest(coords) {
  var obj = {
    "latitude": coords.latitude,
    "longitude": coords.longitude,
    "numNodes": 5
    // Configure the request
  };var options = {
    url: 'http://199.217.113.179:7782/nodes/nearest',
    method: 'POST',
    json: true,
    body: obj
    // Send the request
  };return (0, _send2.default)(options);
};

/**
 * Gets the all supernodes by status
 *
 * @param {number} status - 0 for all nodes, 1 for active nodes, 2 for inactive nodes
 *
 * @return {array} - An array of supernodeInfo objects
 */
var get = function get(status) {
  var obj = {
    "status": undefined === status ? 1 : status
    // Configure the request
  };var options = {
    url: 'http://199.217.113.179:7782/nodes',
    method: 'POST',
    json: true,
    body: obj
    // Send the request
  };return (0, _send2.default)(options);
};

module.exports = {
  all: all,
  nearest: nearest,
  get: get
};
//# sourceMappingURL=supernodes.js.map