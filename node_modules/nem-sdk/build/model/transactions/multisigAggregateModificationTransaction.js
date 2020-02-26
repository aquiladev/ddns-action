'use strict';

var _network = require('../network');

var _network2 = _interopRequireDefault(_network);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _transactionTypes = require('../transactionTypes');

var _transactionTypes2 = _interopRequireDefault(_transactionTypes);

var _keyPair = require('../../crypto/keyPair');

var _keyPair2 = _interopRequireDefault(_keyPair);

var _fees = require('../fees');

var _fees2 = _interopRequireDefault(_fees);

var _objects = require('../objects');

var _objects2 = _interopRequireDefault(_objects);

var _address = require('../address');

var _address2 = _interopRequireDefault(_address);

var _multisigWrapper = require('./multisigWrapper');

var _multisigWrapper2 = _interopRequireDefault(_multisigWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a multisig aggregate modification transaction object
 *
 * @param {object} common - A common object
 * @param {object} tx - An un-prepared multisigAggregateModificationTransaction object
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigAggregateModificationTransaction]{@link http://bob.nem.ninja/docs/#multisigAggregateModificationTransaction} object ready for serialization
 */
var prepare = function prepare(common, tx, network) {
    if (!common || !tx || !network) throw new Error('Missing parameter !');
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    var actualSender = tx.isMultisig ? tx.multisigAccount.publicKey : kp.publicKey.toString();
    var due = network === _network2.default.data.testnet.id ? 60 : 24 * 60;
    var entity = _construct(actualSender, tx.modifications, tx.relativeChange, tx.isMultisig, due, network);
    if (tx.isMultisig) {
        entity = (0, _multisigWrapper2.default)(kp.publicKey.toString(), entity, due, network);
    }
    return entity;
};

/**
 * Create a multisignature aggregate modification transaction object
 *
 * @param {string} senderPublicKey - The sender account public key
 * @param {array} modifications - An array of [MultisigCosignatoryModification]{@link http://bob.nem.ninja/docs/#multisigCosignatoryModification} objects  
 * @param {number} relativeChange - The number of signature to add or remove (ex: 1 to add +1 or -1 to remove one)
 * @param {boolean} isMultisig - True if transaction is multisig, false otherwise
 * @param {number} due - The deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigAggregateModificationTransaction]{@link http://bob.nem.ninja/docs/#multisigAggregateModificationTransaction} object
 */
var _construct = function _construct(senderPublicKey, modifications, relativeChange, isMultisig, due, network) {
    var timeStamp = _helpers2.default.createNEMTimeStamp();
    var hasNoRelativeChange = relativeChange === null || relativeChange === 0;
    var version = hasNoRelativeChange ? _network2.default.getVersion(1, network) : _network2.default.getVersion(2, network);
    var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.multisigModification, senderPublicKey, timeStamp, due, version);
    var totalFee = _fees2.default.multisigAggregateModificationTransaction;
    var custom = {
        'fee': totalFee,
        'modifications': modifications,
        'minCosignatories': {
            'relativeChange': 0
        }
        // If multisig, it is a modification of an existing contract, otherwise it is a creation
    };if (isMultisig) {
        // If no relative change, no minCosignatories property
        if (hasNoRelativeChange) delete custom.minCosignatories;else custom.minCosignatories.relativeChange = relativeChange;

        // Sort modification array
        if (custom.modifications.length > 1) {
            custom.modifications.sort(function (a, b) {
                return a.modificationType - b.modificationType || _address2.default.toAddress(a.cosignatoryAccount, network).localeCompare(_address2.default.toAddress(b.cosignatoryAccount, network));
            });
        }
    } else {
        custom.minCosignatories.relativeChange = relativeChange;

        // Sort modification array by addresses
        if (custom.modifications.length > 1) {
            custom.modifications.sort(function (a, b) {
                if (_address2.default.toAddress(a.cosignatoryAccount, network) < _address2.default.toAddress(b.cosignatoryAccount, network)) return -1;
                if (_address2.default.toAddress(a.cosignatoryAccount, network) > _address2.default.toAddress(b.cosignatoryAccount, network)) return 1;
                return 0;
            });
        }
    }

    var entity = _helpers2.default.extendObj(data, custom);
    return entity;
};

module.exports = {
    prepare: prepare
};
//# sourceMappingURL=multisigAggregateModificationTransaction.js.map