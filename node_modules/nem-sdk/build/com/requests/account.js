'use strict';

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the AccountMetaDataPair of an account.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
var data = function data(endpoint, address) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/get',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the AccountMetaDataPair of an account with a public Key.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} publicKey - An account public key
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
var dataFromPublicKey = function dataFromPublicKey(endpoint, publicKey) {
	// Configure the public key request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/get/from-public-key',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'publicKey': publicKey }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets an array of harvest info objects for an account.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [HarvestInfo]{@link http://bob.nem.ninja/docs/#harvestInfo} objects
 */
var harvestedBlocks = function harvestedBlocks(endpoint, address) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/harvests',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets an array of TransactionMetaDataPair objects where the recipient has the address given as parameter to the request.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - The 256 bit sha3 hash of the transaction up to which transactions are returned. (optional)
 * @param {string} txId - The transaction id up to which transactions are returned. (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
var incomingTransactions = function incomingTransactions(endpoint, address, txHash, txId) {
	// Arrange
	var params = { 'address': address };
	if (txHash) params['hash'] = txHash;
	if (txId) params['id'] = txId;

	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/transfers/incoming',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: params
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets an array of TransactionMetaDataPair objects where the sender has the address given as parameter to the request.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - The 256 bit sha3 hash of the transaction up to which transactions are returned. (optional)
 * @param {string} txId - The transaction id up to which transactions are returned. (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
var outgoingTransactions = function outgoingTransactions(endpoint, address, txHash, txId) {
	// Arrange
	var params = { 'address': address };
	if (txHash) params['hash'] = txHash;
	if (txId) params['id'] = txId;

	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/transfers/outgoing',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: params
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [UnconfirmedTransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#unconfirmedTransactionMetaDataPair} objects
 */
var unconfirmedTransactions = function unconfirmedTransactions(endpoint, address) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/unconfirmedTransactions',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets information about the maximum number of allowed harvesters and how many harvesters are already using the node
 *
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {object} - An [UnlockInfo]{@link http://bob.nem.ninja/docs/#retrieving-the-unlock-info} object
 */
var unlockInfo = function unlockInfo(endpoint) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/unlocked/info',
		method: 'POST',
		headers: _headers2.default.urlEncoded
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Unlocks an account (starts harvesting).
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} privateKey - A delegated account private key
 *
 * @return - Nothing
 */
var startHarvesting = function startHarvesting(endpoint, privateKey) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/unlock',
		method: 'POST',
		json: true,
		body: { 'value': privateKey }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
* Locks an account (stops harvesting).
*
* @param {object} endpoint - An NIS endpoint object
* @param {string} privateKey - A delegated account private key
*
* @return - Nothing
*/
var stopHarvesting = function stopHarvesting(endpoint, privateKey) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/lock',
		method: 'POST',
		json: true,
		body: { 'value': privateKey }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the AccountMetaDataPair of the account for which the given account is the delegate account
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
var forwarded = function forwarded(endpoint, address) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/get/forwarded',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets namespaces that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} parent - The namespace parent (optional)
 *
 * @return {object} - An array of [NamespaceMetaDataPair]{@link http://bob.nem.ninja/docs/#namespaceMetaDataPair} objects
 */
var namespacesOwned = function namespacesOwned(endpoint, address, parent) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/namespace/page',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address, 'parent': parent || "" }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets mosaic definitions that an account has created
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} parent - The namespace parent (optional)
 *
 * @return {object} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
var mosaicDefinitionsCreated = function mosaicDefinitionsCreated(endpoint, address, parent) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/mosaic/definition/page',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address, 'parent': parent || "" }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets mosaic definitions that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
var mosaicDefinitions = function mosaicDefinitions(endpoint, address) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/mosaic/owned/definition',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets mosaics that an account owns
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 *
 * @return {array} - An array of [Mosaic]{@link http://bob.nem.ninja/docs/#mosaic} objects
 */
var mosaicsOwned = function mosaicsOwned(endpoint, address) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/mosaic/owned',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'address': address }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets all transactions of an account
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {string} txHash - The 256 bit sha3 hash of the transaction up to which transactions are returned. (optional)
 * @param {string} txId - The transaction id up to which transactions are returned. (optional)
 *
 * @return {array} - An array of [TransactionMetaDataPair]{@link http://bob.nem.ninja/docs/#transactionMetaDataPair} objects
 */
var allTransactions = function allTransactions(endpoint, address, txHash, txId) {
	// Arrange
	var params = { 'address': address };
	if (txHash) params['hash'] = txHash;
	if (txId) params['id'] = txId;

	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/transfers/all',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: params
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the AccountMetaDataPair of an array of accounts.
 *
 * @param {string} endpoint - An NIS endpoint object
 * @param {array} addresses - An array of account addresses
 *
 * @return {object} - An object that contains an array of [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} objects
 */
var getBatchAccountData = function getBatchAccountData(endpoint, addresses) {
	var obj = {
		'data': []
	};
	for (var i = 0; i < addresses.length; i++) {
		obj.data.push({ 'account': addresses[i] });
	}
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/get/batch',
		method: 'POST',
		json: true,
		body: obj
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the AccountMetaDataPair of an array of accounts from an historical height.
 *
 * @param {string} endpoint - An NIS endpoint object
 * @param {array} addresses - An array of account addresses
 * @param {integer} block - The block height
 *
 * @return {object} - Account information for all the accounts on the given block
 */
var getBatchHistoricalAccountData = function getBatchHistoricalAccountData(endpoint, addresses, block) {
	var obj = {
		'accounts': [],
		'startHeight': block,
		'endHeight': block,
		'incrementBy': 1
	};
	for (var i = 0; i < addresses.length; i++) {
		obj.accounts.push({ 'account': addresses[i] });
	}
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/historical/get/batch',
		method: 'POST',
		json: true,
		body: obj
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the AccountMetaDataPair of an account from a certain block.
 *
 * @param {string} endpoint - An NIS endpoint object
 * @param {string} address - An account address
 * @param {integer} block - the block height
 *
 * @return {object} - An [AccountMetaDataPair]{@link http://bob.nem.ninja/docs/#accountMetaDataPair} object
 */
var getHistoricalAccountData = function getHistoricalAccountData(endpoint, address, block) {
	var obj = {
		'params': {
			'address': address,
			'startHeight': block,
			'endHeight': block,
			'increment': 1
		}
	};
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/account/historical/get',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: obj
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	data: data,
	dataFromPublicKey: dataFromPublicKey,
	batchData: getBatchAccountData,
	historical: {
		data: getHistoricalAccountData,
		batchData: getBatchHistoricalAccountData
	},
	unlockInfo: unlockInfo,
	forwarded: forwarded,
	mosaics: {
		owned: mosaicsOwned,
		definitions: mosaicDefinitionsCreated,
		allDefinitions: mosaicDefinitions
	},
	namespaces: {
		owned: namespacesOwned
	},
	harvesting: {
		blocks: harvestedBlocks,
		start: startHarvesting,
		stop: stopHarvesting
	},
	transactions: {
		incoming: incomingTransactions,
		outgoing: outgoingTransactions,
		unconfirmed: unconfirmedTransactions,
		all: allTransactions
	}
};
//# sourceMappingURL=account.js.map