'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _connector = require('./connector');

var _connector2 = _interopRequireDefault(_connector);

var _account = require('./account');

var _account2 = _interopRequireDefault(_account);

var _chain = require('./chain');

var _chain2 = _interopRequireDefault(_chain);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	connector: _connector2.default,
	requests: {
		account: _account2.default.requests,
		chain: _chain2.default.requests
	},
	subscribe: {
		account: _account2.default.subscribe,
		chain: _chain2.default.subscribe,
		errors: _errors2.default.subscribe
	}
};
//# sourceMappingURL=index.js.map