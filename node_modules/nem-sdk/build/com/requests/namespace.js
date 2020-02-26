'use strict';

var _send = require('./send');

var _send2 = _interopRequireDefault(_send);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets root namespaces.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {number} id - The namespace id up to which root namespaces are returned (optional)
 *
 * @return {object} - An array of [NamespaceMetaDataPair]{@link http://bob.nem.ninja/docs/#namespaceMetaDataPair} objects
 */
var roots = function roots(endpoint, id) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/namespace/root/page',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: undefined === id ? { 'pageSize': 100 } : { 'id': id, 'pageSize': 100 }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets mosaic definitions of a namespace
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - A namespace id
 *
 * @return {object} - An array of [MosaicDefinition]{@link http://bob.nem.ninja/docs/#mosaicDefinition} objects
 */
var mosaicDefinitions = function mosaicDefinitions(endpoint, id) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/namespace/mosaic/definition/page',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'namespace': id }
		// Send the request
	};return (0, _send2.default)(options);
};

/**
 * Gets the namespace with given id.
 *
 * @param {object} endpoint - An NIS endpoint object
 * @param {string} id - A namespace id
 *
 * @return {object} - A [NamespaceInfo]{@link http://bob.nem.ninja/docs/#namespace} object
 */
var info = function info(endpoint, id) {
	// Configure the request
	var options = {
		url: _helpers2.default.formatEndpoint(endpoint) + '/namespace',
		method: 'GET',
		headers: _headers2.default.urlEncoded,
		qs: { 'namespace': id }
		// Send the request
	};return (0, _send2.default)(options);
};

module.exports = {
	roots: roots,
	mosaicDefinitions: mosaicDefinitions,
	info: info
};
//# sourceMappingURL=namespace.js.map