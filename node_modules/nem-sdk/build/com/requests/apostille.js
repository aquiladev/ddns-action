'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _nodes = require('../../model/nodes');

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Audit an apostille file
 *
 * @param {string} publicKey - The signer public key
 * @param {string} data - The file data of audited file
 * @param {string} signedData - The signed data into the apostille transaction message
 *
 * @return {boolean} - True if valid, false otherwise
 */
var audit = function audit(publicKey, data, signedData) {
	// Configure the request
	var options = {
		url: _nodes2.default.apostilleAuditServer,
		method: 'POST',
		headers: _headers2.default.urlEncoded,
		qs: { 'publicKey': publicKey, 'data': data, 'signedData': signedData }
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	audit: audit
};
//# sourceMappingURL=apostille.js.map