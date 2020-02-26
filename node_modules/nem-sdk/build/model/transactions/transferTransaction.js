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

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared transfer transaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
var prepare = function prepare(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    var recipientCompressedKey = tx.recipient.toString();
    var amount = Math.round(tx.amount * 1000000);
    var message = _message2.default.prepare(common, tx);
    var msgFee = _fees2.default.calculateMessage(message, common.isHW);
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;
    var mosaics = null;
    var mosaicsFee = null;
    var entity = _construct(actualSender, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network);
    if (tx.isMultisig) {
        entity = (0, _multisigWrapper2.default)(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
};

/**
 * Prepare a mosaic transfer transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - The un-prepared transfer transaction object
 * @param {object} mosaicDefinitionMetaDataPair - The mosaicDefinitionMetaDataPair object with properties of mosaics to send
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object ready for serialization
 */
var prepareMosaic = function prepareMosaic(common, tx, mosaicDefinitionMetaDataPair, network) {
    if (!common || !tx || !mosaicDefinitionMetaDataPair || tx.mosaics === null || !network) throw new Error('Missing parameter !');
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    var recipientCompressedKey = tx.recipient.toString();
    var amount = Math.round(tx.amount * 1000000);
    var message = _message2.default.prepare(common, tx);
    var msgFee = _fees2.default.calculateMessage(message, common.isHW);
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;
    var mosaics = tx.mosaics;
    var mosaicsFee = _fees2.default.calculateMosaics(amount, mosaicDefinitionMetaDataPair, mosaics);
    var entity = _construct(actualSender, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network);
    if (tx.isMultisig) {
        entity = (0, _multisigWrapper2.default)(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
};

/***
 * Create a transfer transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} recipientCompressedKey - The recipient account public key
 * @param {number} amount - The amount to send in micro XEM
 * @param {object} message - The message object
 * @param {number} due - The deadline in minutes
 * @param {array} mosaics - The array of mosaics to send
 * @param {number} mosaicFee - The fees for mosaics included in the transaction
 * @param {number} network - A network id
 *
 * @return {object} - A [TransferTransaction]{@link http://bob.nem.ninja/docs/#transferTransaction} object
 */
var _construct = function _construct(senderPublicKey, recipientCompressedKey, amount, message, msgFee, due, mosaics, mosaicsFee, network) {
    var timeStamp = _helpers2.default.createNEMTimeStamp();
    var version = mosaics ? _network2.default.getVersion(2, network) : _network2.default.getVersion(1, network);
    var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.transfer, senderPublicKey, timeStamp, due, version);
    var fee = mosaics ? mosaicsFee : _fees2.default.currentFeeFactor * _fees2.default.calculateMinimum(amount / 1000000);
    var totalFee = Math.floor((msgFee + fee) * 1000000);
    var custom = {
        'recipient': recipientCompressedKey.toUpperCase().replace(/-/g, ''),
        'amount': amount,
        'fee': totalFee,
        'message': message,
        'mosaics': mosaics
    };
    var entity = _helpers2.default.extendObj(data, custom);
    return entity;
};

module.exports = {
    prepare: prepare,
    prepareMosaic: prepareMosaic
};
//# sourceMappingURL=transferTransaction.js.map