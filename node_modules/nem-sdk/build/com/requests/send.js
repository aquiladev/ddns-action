'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Send a request
 *
 * @param {object} options - The options of the request
 *
 * @return {Promise} - A resolved promise with the requested data or a rejection with error data
 */
var send = function send(options) {
	return new Promise(function (resolve, reject) {
		(0, _request2.default)(options, function (error, response, body) {
			var data = void 0;
			if (_helpers2.default.isJSON(body)) {
				data = JSON.parse(body);
			} else {
				data = body;
			}
			if (!error && response.statusCode == 200) {
				resolve(data);
			} else {
				if (!error) {
					reject({ "code": 0, "data": data });
				} else {
					reject({ "code": -1, "data": error });
				}
			}
		});
	});
};

exports.default = send;
//# sourceMappingURL=send.js.map