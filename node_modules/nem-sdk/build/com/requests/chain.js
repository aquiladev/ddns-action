'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the current height of the block chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [BlockHeight]{@link http://bob.nem.ninja/docs/#block-chain-height} object
 */
var height = function height(endpoint) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/chain/height',
		method: 'GET'
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the current last block of the chain.
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} -
 */
var lastBlock = function lastBlock(endpoint) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/chain/last-block',
		method: 'GET'
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets network time (in ms)
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - A [communicationTimeStamps]{@link http://bob.nem.ninja/docs/#communicationTimeStamps} object
 */
var time = function time(endpoint) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/time-sync/network-time',
		method: 'GET'
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets a block by its height
 *
 * @param {string} endpoint - An NIS endpoint object
 * @param {integer} height - The height of the block
 *
 * @return {object} - A block object
 */
var blockByHeight = function blockByHeight(endpoint, height) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/block/at/public',
		method: 'POST',
		json: true,
		body: { 'height': height }
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	height: height,
	lastBlock: lastBlock,
	time: time,
	blockByHeight: blockByHeight
};
//# sourceMappingURL=chain.js.map