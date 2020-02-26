'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _network = require('../network');

var _network2 = _interopRequireDefault(_network);

var _helpers = require('../../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _transactionTypes = require('../transactionTypes');

var _transactionTypes2 = _interopRequireDefault(_transactionTypes);

var _fees = require('../fees');

var _fees2 = _interopRequireDefault(_fees);

var _objects = require('../objects');

var _objects2 = _interopRequireDefault(_objects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrap a transaction in a multisignature transaction
 *
 * @param {string} senderPublicKey - The sender public key
 * @param {object} innerEntity - The transaction entity to wrap
 * @param {number} due - The transaction deadline in minutes
 * @param {number} network - A network id
 *
 * @return {object} - A [MultisigTransaction]{@link http://bob.nem.ninja/docs/#multisigTransaction} object
 */
var multisigWrapper = function multisigWrapper(senderPublicKey, innerEntity, due, network) {
  var timeStamp = _helpers2.default.createNEMTimeStamp();
  var version = _network2.default.getVersion(1, network);
  var data = _objects2.default.create("commonTransactionPart")(_transactionTypes2.default.multisigTransaction, senderPublicKey, timeStamp, due, version, network);
  var custom = {
    'fee': _fees2.default.multisigTransaction,
    'otherTrans': innerEntity
  };
  var entity = _helpers2.default.extendObj(data, custom);
  return entity;
};

exports.default = multisigWrapper;
//# sourceMappingURL=multisigWrapper.js.map