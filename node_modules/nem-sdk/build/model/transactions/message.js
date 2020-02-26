'use strict';

var _cryptoHelpers = require('../../crypto/cryptoHelpers');

var _cryptoHelpers2 = _interopRequireDefault(_cryptoHelpers);

var _convert = require('../../utils/convert');

var _convert2 = _interopRequireDefault(_convert);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a message object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared transferTransaction object
 *
 * @return {object} - A prepared message object
 */
var prepare = function prepare(common, tx) {
    if (tx.messageType === 2 && common.privateKey) {
        return {
            'type': 2,
            'payload': _cryptoHelpers2.default.encode(common.privateKey, tx.recipientPublicKey, tx.message.toString())
        };
    } else if (tx.messageType === 2 && common.isHW) {
        return {
            'type': 2,
            'payload': _convert2.default.utf8ToHex(tx.message.toString()),
            'publicKey': tx.recipientPublicKey
        };
    } else if (tx.messageType === 0 && _helpers2.default.isHexadecimal(tx.message.toString())) {
        return {
            'type': 1,
            'payload': 'fe' + tx.message.toString()
        };
    } else {
        return {
            'type': 1,
            'payload': _convert2.default.utf8ToHex(tx.message.toString())
        };
    }
};

module.exports = {
    prepare: prepare
};
//# sourceMappingURL=message.js.map