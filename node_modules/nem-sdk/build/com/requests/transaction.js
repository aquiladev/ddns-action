'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Broadcast a transaction to the NEM network
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {object} obj - A RequestAnnounce object
 *
 * @return {object} - A [NemAnnounceResult]{@link http://bob.nem.ninja/docs/#nemAnnounceResult} object
 */
var announce = function announce(endpoint, serializedTransaction) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/transaction/announce',
		method: 'POST',
		headers: _headers2.default.json(serializedTransaction),
		json: JSON.parse(serializedTransaction)
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets a TransactionMetaDataPair object from the chain using it's hash
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} txHash - A transaction hash
 *
 * @return {object} - A [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} object
 */
var byHash = function byHash(endpoint, txHash) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/transaction/get',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'hash': txHash }
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	announce: announce,
	byHash: byHash
};
//# sourceMappingURL=transaction.js.map