'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _convert = require('../../utils/convert');

var _convert2 = _interopRequireDefault(_convert);

var _serialization = require('../../utils/serialization');

var _serialization2 = _interopRequireDefault(_serialization);

var _keyPair = require('../../crypto/keyPair');

var _keyPair2 = _interopRequireDefault(_keyPair);

var _requests = require('../../com/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serialize a transaction and broadcast it to the network
 *
 * @param {object} common - A common object
 * @param {object} entity - A prepared transaction object
 * @param {object} endpoint - An NIS endpoint object
 *
 * @return {promise} - An announce transaction promise of the com.requests service
 */
var send = function send(common, entity, endpoint) {
    if (!endpoint || !entity || !common) throw new Error('Missing parameter !');
    if (common.privateKey.length !== 64 && common.privateKey.length !== 66) throw new Error('Invalid private key, length must be 64 or 66 characters !');
    if (!_helpers2.default.isHexadecimal(common.privateKey)) throw new Error('Private key must be hexadecimal only !');
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var result = _serialization2.default.serializeTransaction(entity);
    var signature = kp.sign(result);
    var obj = {
        'data': _convert2.default.ua2hex(result),
        'signature': signature.toString()
    };
    return _requests2.default.transaction.announce(endpoint, JSON.stringify(obj));
};

exports.default = send;
//# sourceMappingURL=send.js.map