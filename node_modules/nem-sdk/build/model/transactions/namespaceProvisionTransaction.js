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

var _sinks = require('../sinks');

var _sinks2 = _interopRequireDefault(_sinks);

var _multisigWrapper = require('./multisigWrapper');

var _multisigWrapper2 = _interopRequireDefault(_multisigWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a namespace provision transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared namespaceProvisionTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [ProvisionNamespaceTransaction]{@link http://bob.nem.ninja/docs/#provisionNamespaceTransaction} object ready for serialization
 */
var prepare = function prepare(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    var rentalFeeSink = _sinks2.default.namespace[network].toUpperCase().replace(/-/g, '');
    var rentalFee = void 0;
    // Set fee depending if namespace or sub
    if (tx.namespaceParent) {
        rentalFee = _fees2.default.subProvisionNamespaceTransaction;
    } else {
        rentalFee = _fees2.default.rootProvisionNamespaceTransaction;
    }
    var namespaceParent = tx.namespaceParent ? tx.namespaceParent.fqn : null;
    var namespaceName = tx.namespaceName.toString();
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;
    var entity = _construct(actualSender, rentalFeeSink, rentalFee, namespaceParent, namespaceName, due, network);
    if (tx.isMultisig) {
        entity = (0, _multisigWrapper2.default)(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
};

/***
 * Create a namespace provision transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} rentalFeeSink - The rental sink account
 * @param {number} rentalFee - The rental fee
 * @param {string} namespaceParent - The parent namespace
 * @param {string} namespaceName  - The namespace name
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [ProvisionNamespaceTransaction]{@link http://bob.nem.ninja/docs/#provisionNamespaceTransaction} object
 */
var _construct = function _construct(senderPublicKey, rentalFeeSink, rentalFee, namespaceParent, namespaceName, due, network) {
    var timeStamp = _helpers2.default.createNEMTimeStamp();
    var version = _network2.default.getVersion(1, network);
    var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.provisionNamespace, senderPublicKey, timeStamp, due, version);
    var fee = _fees2.default.namespaceAndMosaicCommon;
    var custom = {
        'rentalFeeSink': rentalFeeSink.toUpperCase().replace(/-/g, ''),
        'rentalFee': rentalFee,
        'parent': namespaceParent,
        'newPart': namespaceName,
        'fee': fee
    };
    var entity = _helpers2.default.extendObj(data, custom);
    return entity;
};

module.exports = {
    prepare: prepare
};
//# sourceMappingURL=namespaceProvisionTransaction.js.map