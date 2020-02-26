'use strict';

var _transferTransaction = require('./transactions/transferTransaction');

var _transferTransaction2 = _interopRequireDefault(_transferTransaction);

var _signatureTransaction = require('./transactions/signatureTransaction');

var _signatureTransaction2 = _interopRequireDefault(_signatureTransaction);

var _mosaicDefinitionTransaction = require('./transactions/mosaicDefinitionTransaction');

var _mosaicDefinitionTransaction2 = _interopRequireDefault(_mosaicDefinitionTransaction);

var _mosaicSupplyChange = require('./transactions/mosaicSupplyChange');

var _mosaicSupplyChange2 = _interopRequireDefault(_mosaicSupplyChange);

var _multisigAggregateModificationTransaction = require('./transactions/multisigAggregateModificationTransaction');

var _multisigAggregateModificationTransaction2 = _interopRequireDefault(_multisigAggregateModificationTransaction);

var _namespaceProvisionTransaction = require('./transactions/namespaceProvisionTransaction');

var _namespaceProvisionTransaction2 = _interopRequireDefault(_namespaceProvisionTransaction);

var _importanceTransferTransaction = require('./transactions/importanceTransferTransaction');

var _importanceTransferTransaction2 = _interopRequireDefault(_importanceTransferTransaction);

var _send = require('./transactions/send');

var _send2 = _interopRequireDefault(_send);

var _message = require('./transactions/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepare a transaction object 
 *
 * @param {string} objectName - The name of the object to prepare
 *
 * @retrun {function} - The prepare function corresponding to the object name
 */
var prepare = function prepare(objectName) {
    switch (objectName) {
        case "transferTransaction":
            return _transferTransaction2.default.prepare;
            break;
        case "mosaicTransferTransaction":
            return _transferTransaction2.default.prepareMosaic;
            break;
        case "mosaicDefinitionTransaction":
            return _mosaicDefinitionTransaction2.default.prepare;
            break;
        case "multisigAggregateModificationTransaction":
            return _multisigAggregateModificationTransaction2.default.prepare;
            break;
        case "namespaceProvisionTransaction":
            return _namespaceProvisionTransaction2.default.prepare;
            break;
        case "signatureTransaction":
            return _signatureTransaction2.default.prepare;
            break;
        case "mosaicSupplyChangeTransaction":
            return _mosaicSupplyChange2.default.prepare;
            break;
        case "importanceTransferTransaction":
            return _importanceTransferTransaction2.default.prepare;
            break;
        default:
            return {};
    }
};

module.exports = {
    prepare: prepare,
    send: _send2.default,
    prepareMessage: _message2.default.prepare
};
//# sourceMappingURL=transactions.js.map