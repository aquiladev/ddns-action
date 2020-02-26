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
 * Prepare a mosaic definition transaction
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared mosaicDefinitionTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicDefinitionCreationTransaction]{@link http://bob.nem.ninja/docs/#mosaicDefinitionCreationTransaction} object ready for serialization
 */
var prepare = function prepare(common, tx, network) {
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    var rentalFeeSink = _sinks2.default.mosaic[network].toUpperCase().replace(/-/g, '');
    var rentalFee = _fees2.default.mosaicDefinitionTransaction;
    var namespaceParent = tx.namespaceParent.fqn;
    var mosaicName = tx.mosaicName.toString();
    var mosaicDescription = tx.mosaicDescription.toString();
    var mosaicProperties = tx.properties;
    var levy = tx.levy.mosaic ? tx.levy : null;
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;
    var entity = _construct(actualSender, rentalFeeSink, rentalFee, namespaceParent, mosaicName, mosaicDescription, mosaicProperties, levy, due, network);
    if (tx.isMultisig) {
        entity = (0, _multisigWrapper2.default)(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
};

/***
 * Create a mosaic definition transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {string} rentalFeeSink - The rental sink account
 * @param {number} rentalFee - The rental fee
 * @param {string} namespaceParent - The parent namespace
 * @param {string} mosaicName - The mosaic name
 * @param {string} mosaicDescription - The mosaic description
 * @param {object} mosaicProperties - The mosaic properties object
 * @param {object} levy - The levy object
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MosaicDefinitionCreationTransaction]{@link http://bob.nem.ninja/docs/#mosaicDefinitionCreationTransaction} object
 */
var _construct = function _construct(senderPublicKey, rentalFeeSink, rentalFee, namespaceParent, mosaicName, mosaicDescription, mosaicProperties, levy, due, network) {
    var timeStamp = _helpers2.default.createNEMTimeStamp();
    var version = _network2.default.getVersion(1, network);
    var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.mosaicDefinition, senderPublicKey, timeStamp, due, version);
    var fee = _fees2.default.namespaceAndMosaicCommon;
    var levyData = levy ? {
        'type': levy.feeType,
        'recipient': levy.address.toUpperCase().replace(/-/g, ''),
        'mosaicId': levy.mosaic,
        'fee': levy.fee
    } : null;
    var custom = {
        'creationFeeSink': rentalFeeSink.replace(/-/g, ''),
        'creationFee': rentalFee,
        'mosaicDefinition': {
            'creator': senderPublicKey,
            'id': {
                'namespaceId': namespaceParent,
                'name': mosaicName
            },
            'description': mosaicDescription,
            'properties': Object.keys(mosaicProperties).map(function (key, index) {
                return { "name": key, "value": mosaicProperties[key].toString() };
            }),
            'levy': levyData
        },
        'fee': fee
    };
    var entity = _helpers2.default.extendObj(data, custom);
    return entity;
};

module.exports = {
    prepare: prepare
};
//# sourceMappingURL=mosaicDefinitionTransaction.js.map