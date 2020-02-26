'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _nodes = require('../../model/nodes');

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets market information from Poloniex api
 *
 * @return {object} - A MarketInfo object
 */
var xem = function xem() {
	// Configure the request
	var options = {
		url: _nodes2.default.marketInfo,
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'command': 'returnTicker' }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets BTC price from blockchain.info API
 *
 * @return {object} - A MarketInfo object
 */
var btc = function btc() {
	// Configure the request
	var options = {
		url: _nodes2.default.btcPrice,
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'cors': true }
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	xem: xem,
	btc: btc
};
//# sourceMappingURL=market.js.map