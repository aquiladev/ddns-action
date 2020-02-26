"use strict";

/**
 * An un-prepared transfer transaction object
 *
 * @param {string} recipient - A NEM account address
 * @param {number} amount - A number of XEM
 * @param {string} message - A message
 *
 * @return {object}
 */
var transfer = function transfer(recipient, amount, message) {
    return {
        "amount": amount || 0,
        "recipient": recipient || "",
        "recipientPublicKey": "",
        "isMultisig": false,
        "multisigAccount": "",
        "message": message || "",
        "messageType": 1,
        "mosaics": []
    };
};

/**
 * An un-prepared signature transaction object
 *
 * @param  {string} multisigAccount - The multisig account address
 * @param  {string} txHash - The multisig transaction hash
 *
 * @return {object}
 */
var signature = function signature(multisigAccount, txHash) {
    var compressedAccount = "";
    if (typeof multisigAccount != "undefined" && multisigAccount.length) {
        compressedAccount = multisigAccount.toUpperCase().replace(/-/g, "");
    }

    return {
        "otherHash": {
            "data": txHash || ""
        },
        "otherAccount": compressedAccount
    };
};

/**
 * An un-prepared mosaic definition transaction object
 *
 * @return {object}
 */
var mosaicDefinition = function mosaicDefinition() {
    return {
        "mosaicName": "",
        "namespaceParent": "",
        "mosaicDescription": "",
        "properties": {
            "initialSupply": 0,
            "divisibility": 0,
            "transferable": true,
            "supplyMutable": true
        },
        "levy": {
            "mosaic": null,
            "address": "",
            "feeType": 1,
            "fee": 5
        },
        "isMultisig": false,
        "multisigAccount": ""
    };
};

/**
 * An un-prepared mosaic supply change transaction object
 *
 * @return {object}
 */
var mosaicSupplyChange = function mosaicSupplyChange() {
    return {
        "mosaic": "",
        "supplyType": 1,
        "delta": 0,
        "isMultisig": false,
        "multisigAccount": ""
    };
};

/**
 * An un-prepared multisig aggregate modification transaction object
 *
 * @return {object}
 */
var multisigAggregateModification = function multisigAggregateModification() {
    return {
        "modifications": [],
        "relativeChange": null,
        "isMultisig": false,
        "multisigAccount": ""
    };
};

/**
 * An un-prepared namespace provision transaction object
 *
 * @param {string} namespaceName - A namespace name
 * @param {string} namespaceParent - A namespace name
 *
 * @return {object}
 */
var namespaceProvision = function namespaceProvision(namespaceName, namespaceParent) {
    return {
        "namespaceName": namespaceName || "",
        "namespaceParent": namespaceParent || null,
        "isMultisig": false,
        "multisigAccount": ""
    };
};

/**
 * An un-prepared importance transfer transaction object
 *
 * @param {string} remoteAccount - A remote public key
 * @param {number} mode - 1 for activating, 2 for deactivating
 *
 * @return {object}
 */
var importanceTransfer = function importanceTransfer(remoteAccount, mode) {
    return {
        "remoteAccount": remoteAccount || "",
        "mode": mode || "",
        "isMultisig": false,
        "multisigAccount": ""
    };
};

/**
 * The common part of transactions
 *
 * @param {number} txType - A type of transaction
 * @param {string} senderPublicKey - A sender public key
 * @param {number} timeStamp - A timestamp for the transation
 * @param {number} due - A deadline in minutes
 * @param {number} version - A network version
 * @param {number} network - A network id
 *
 * @return {object} - A common transaction object
 */
var commonPart = function commonPart(txtype, senderPublicKey, timeStamp, due, version, network) {
    return {
        'type': txtype || "",
        'version': version || "",
        'signer': senderPublicKey || "",
        'timeStamp': timeStamp || "",
        'deadline': timeStamp + due * 60 || ""
    };
};

module.exports = {
    multisigAggregateModification: multisigAggregateModification,
    transfer: transfer,
    signature: signature,
    mosaicDefinition: mosaicDefinition,
    mosaicSupplyChange: mosaicSupplyChange,
    namespaceProvision: namespaceProvision,
    importanceTransfer: importanceTransfer,
    commonPart: commonPart
};
//# sourceMappingURL=transactions.js.map