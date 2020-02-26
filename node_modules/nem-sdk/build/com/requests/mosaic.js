'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the current supply of a mosaic
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - A mosaic id
 *
 * @return {object} - A mosaicSupplyInfo object
 */
var supply = function supply(endpoint, id) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/mosaic/supply',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'mosaicId': id }
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	supply: supply
};
//# sourceMappingURL=mosaic.js.map