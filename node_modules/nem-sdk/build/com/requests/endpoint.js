'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Determines if NIS is up and responsive.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [NemRequestResult]{@link http://bob.nem.ninja/docs/#nemRequestResult} object
 */
var heartbeat = function heartbeat(endpoint) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/heartbeat',
		method: 'GET'
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	heartbeat: heartbeat
};
//# sourceMappingURL=endpoint.js.map