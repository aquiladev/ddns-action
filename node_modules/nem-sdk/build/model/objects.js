'use strict';

var _account = require('./objects/account');

var _account2 = _interopRequireDefault(_account);

var _miscellaneous = require('./objects/miscellaneous');

var _miscellaneous2 = _interopRequireDefault(_miscellaneous);

var _mosaic = require('./objects/mosaic');

var _mosaic2 = _interopRequireDefault(_mosaic);

var _transactions = require('./objects/transactions');

var _transactions2 = _interopRequireDefault(_transactions);

var _qr = require('./objects/qr');

var _qr2 = _interopRequireDefault(_qr);

var _wallet = require('./objects/wallet');

var _wallet2 = _interopRequireDefault(_wallet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get an empty object 
 *
 * @param {string} objectName - The name of the object
 *
 * @return {object} - The desired object
 */
var get = function get(objectName) {
    return _fetch(0, objectName);
};

/**
 * Create an object
 *
 * @param {string} objectName - The name of the object
 *
 * @return {function} - The object creation function corresponding to the object name
 */
var create = function create(objectName) {
    return _fetch(1, objectName);
};

/**
 * Fetch objects
 *
 * @param {number} type - 0 for get, 1 for creation
 * @param {string} objectName - The name of the object
 *
 * @return {function|object} - The object creation function corresponding to the object name, or the object
 */
var _fetch = function _fetch(type, objectName) {
    switch (objectName) {
        case "account":
            return !type ? (0, _account2.default)() : _account2.default;
            break;
        case "accountInfoQR":
            return !type ? _qr2.default.accountInfo() : _qr2.default.accountInfo;
            break;
        case "common":
            return !type ? _miscellaneous2.default.common() : _miscellaneous2.default.common;
            break;
        case "commonTransactionPart":
            return !type ? _transactions2.default.commonPart() : _transactions2.default.commonPart;
            break;
        case "endpoint":
            return !type ? _miscellaneous2.default.endpoint() : _miscellaneous2.default.endpoint;
            break;
        case "mosaicAttachment":
            return !type ? _mosaic2.default.attachment() : _mosaic2.default.attachment;
            break;
        case "mosaicDefinitionMetaDataPair":
            return _mosaic2.default.definitionMetaDataPair();
            break;
        case "mosaicDefinitionTransaction":
            return !type ? _transactions2.default.mosaicDefinition() : _transactions2.default.mosaicDefinition;
            break;
        case "invoice":
            return !type ? _qr2.default.invoice() : _qr2.default.invoice;
            break;
        case "transferTransaction":
            return !type ? _transactions2.default.transfer() : _transactions2.default.transfer;
            break;
        case "signatureTransaction":
            return !type ? _transactions2.default.signature() : _transactions2.default.signature;
            break;
        case "messageTypes":
            return _miscellaneous2.default.messageTypes();
            break;
        case "mosaicSupplyChangeTransaction":
            return !type ? _transactions2.default.mosaicSupplyChange() : _transactions2.default.mosaicSupplyChange;
            break;
        case "multisigAggregateModification":
            return !type ? _transactions2.default.multisigAggregateModification() : _transactions2.default.multisigAggregateModification;
            break;
        case "multisigCosignatoryModification":
            return !type ? _miscellaneous2.default.multisigCosignatoryModification() : _miscellaneous2.default.multisigCosignatoryModification;
            break;
        case "namespaceProvisionTransaction":
            return !type ? _transactions2.default.namespaceProvision() : _transactions2.default.namespaceProvision;
            break;
        case "importanceTransferTransaction":
            return !type ? _transactions2.default.importanceTransfer() : _transactions2.default.importanceTransfer;
            break;
        case "wallet":
            return !type ? (0, _wallet2.default)() : _wallet2.default;
            break;
        case "walletQR":
            return !type ? _qr2.default.wallet() : _qr2.default.wallet;
            break;
        default:
            return {};
    }
};

module.exports = {
    get: get,
    create: create
};
//# sourceMappingURL=objects.js.map