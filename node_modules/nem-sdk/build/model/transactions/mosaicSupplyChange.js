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

var _multisigWrapper = require('./multisigWrapper');

var _multisigWrapper2 = _interopRequireDefault(_multisigWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a mosaic supply change transaction
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared mosaicSupplyChangeTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicSupplyChangeTransaction]{@link http://bob.nem.ninja/docs/#mosaicSupplyChangeTransaction} object ready for serialization
 */
var prepare = function prepare(common, tx, network) {
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;
    var entity = _construct(actualSender, tx.mosaic, tx.supplyType, tx.delta, due, network);
    if (tx.isMultisig) {
        entity = (0, _multisigWrapper2.default)(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
};

/***
 * Create a mosaic supply change transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {object} mosaicId - The mosaic id
 * @param {number} supplyType - The type of change
 * @param {number} delta - The amount involved in the change
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicSupplyChangeTransaction]{@link http://bob.nem.ninja/docs/#mosaicSupplyChangeTransaction} object
 */
var _construct = function _construct(senderPublicKey, mosaicId, supplyType, delta, due, network) {
    var timeStamp = _helpers2.default.createNEMTimeStamp();
    var version = _network2.default.getVersion(1, network);
    var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.mosaicSupply, senderPublicKey, timeStamp, due, version);
    var fee = _fees2.default.namespaceAndMosaicCommon;
    var custom = {
        'mosaicId': mosaicId,
        'supplyType': supplyType,
        'delta': delta,
        'fee': fee
    };
    var entity = _helpers2.default.extendObj(data, custom);
    return entity;
};

module.exports = {
    prepare: prepare
};
//# sourceMappingURL=mosaicSupplyChange.js.map