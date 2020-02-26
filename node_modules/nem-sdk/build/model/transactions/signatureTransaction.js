'use strict';

var _network = require('../network');

var _network2 = _interopRequireDefault(_network);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _transactionTypes = require('../transactionTypes');

var _transactionTypes2 = _interopRequireDefault(_transactionTypes);

var _fees = require('../fees');

var _fees2 = _interopRequireDefault(_fees);

var _keyPair = require('../../crypto/keyPair');

var _keyPair2 = _interopRequireDefault(_keyPair);

var _objects = require('../objects');

var _objects2 = _interopRequireDefault(_objects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a signature transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared signature transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigSignatureTransaction]{@link http://bob.nem.ninja/docs/#multisigSignatureTransaction} object ready for serialization
 */
var prepare = function prepare(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;

    var senderPublicKey = kp.publicKey.toString();
    var timeStamp = _helpers2.default.createNEMTimeStamp();
    var version = _network2.default.getVersion(1, network);
    var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.multisigSignature, senderPublicKey, timeStamp, due, version);
    var fee = _fees2.default.signatureTransaction;

    var custom = {
        'fee': fee
    };
    var entity = _helpers2.default.extendObj(tx, data, custom);
    return entity;
};

module.exports = {
    prepare: prepare
};
//# sourceMappingURL=signatureTransaction.js.map