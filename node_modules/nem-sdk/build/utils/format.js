'use strict';

var _convert = require('./convert');

var _convert2 = _interopRequireDefault(_convert);

var _address = require('../model/address');

var _address2 = _interopRequireDefault(_address);

var _transactionTypes = require('../model/transactionTypes');

var _transactionTypes2 = _interopRequireDefault(_transactionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Convert a public key to NEM address
*
* @param {string} input - The account public key
* @param {number} networkId - The current network id
*
* @return {string} - A clean NEM address
*/
var pubToAddress = function pubToAddress(input, networkId) {
    return input && _address2.default.toAddress(input, networkId);
};

/**
* Add hyphens to a clean address
*
* @param {string} input - A NEM address
*
* @return {string} - A formatted NEM address
*/
var address = function address(input) {
    return input && input.toUpperCase().replace(/-/g, '').match(/.{1,6}/g).join('-');
};

/**
* Format a timestamp to NEM date
*
* @param {number} data - A timestamp
*
* @return {string} - A date string
*/
var nemDate = function nemDate(data) {
    var nemesis = Date.UTC(2015, 2, 29, 0, 6, 25);
    if (data === undefined) return data;
    var o = data;
    var t = new Date(nemesis + o * 1000);
    return t.toUTCString();
};

var supply = function supply(data, mosaicId, mosaics) {
    if (data === undefined) return data;
    var mosaicName = mosaicIdToName(mosaicId);
    if (!(mosaicName in mosaics)) {
        return ['unknown mosaic divisibility', data];
    }
    var mosaicDefinitionMetaDataPair = mosaics[mosaicName];
    var divisibilityProperties = $.grep(mosaicDefinitionMetaDataPair.mosaicDefinition.properties, function (w) {
        return w.name === "divisibility";
    });
    var divisibility = divisibilityProperties.length === 1 ? ~~divisibilityProperties[0].value : 0;
    var o = parseInt(data, 10);
    if (!o) {
        if (divisibility === 0) {
            return ["0", ''];
        } else {
            return ["0", o.toFixed(divisibility).split('.')[1]];
        }
    }
    o = o / Math.pow(10, divisibility);
    var b = o.toFixed(divisibility).split('.');
    var r = b[0].split(/(?=(?:...)*$)/).join(" ");
    return [r, b[1] || ""];
};

var supplyRaw = function supplyRaw(data, _divisibility) {
    var divisibility = ~~_divisibility;
    var o = parseInt(data, 10);
    if (!o) {
        if (divisibility === 0) {
            return ["0", ''];
        } else {
            return ["0", o.toFixed(divisibility).split('.')[1]];
        }
    }
    o = o / Math.pow(10, divisibility);
    var b = o.toFixed(divisibility).split('.');
    var r = b[0].split(/(?=(?:...)*$)/).join(" ");
    return [r, b[1] || ""];
};

var levyFee = function levyFee(mosaic, multiplier, levy, mosaics) {
    if (mosaic === undefined || mosaics === undefined) return mosaic;
    if (levy === undefined || levy.type === undefined) return undefined;
    var levyValue = void 0;
    if (levy.type === 1) {
        levyValue = levy.fee;
    } else {
        // Note, multiplier is in micro NEM
        levyValue = multiplier / 1000000 * mosaic.quantity * levy.fee / 10000;
    }
    var r = supply(levyValue, levy.mosaicId, mosaics);
    return r[0] + "." + r[1];
};

/**
* Format a NEM importance score
*
* @param {number} data -  The importance score
*
* @return {array} - A formatted importance score at 10^-4
*/
var nemImportanceScore = function nemImportanceScore(data) {
    if (data === undefined) return data;
    var o = data;
    if (o) {
        o *= 10000;
        o = o.toFixed(4).split('.');
        return [o[0], o[1]];
    }
    return [o, 0];
};

/**
* Format a value to NEM value
*
* @param {number} data - An amount of XEM
*
* @return {array} - An array with values before and after decimal point
*/
var nemValue = function nemValue(data) {
    if (data === undefined) return data;
    var o = data;
    if (!o) {
        return ["0", '000000'];
    } else {
        o = o / 1000000;
        var b = o.toFixed(6).split('.');
        var r = b[0].split(/(?=(?:...)*$)/).join(" ");
        return [r, b[1]];
    }
};

/**
* Return name of an importance transfer mode
*
* @return {string} - An importance transfer mode name
*/
var importanceTransferMode = function importanceTransferMode(data) {
    if (data === undefined) return data;
    var o = data;
    if (o === 1) return "Activation";else if (o === 2) return "Deactivation";else return "Unknown";
};

/**
* Convert hex to utf8
*
* @param {string} data - Hex data
*
* @return {string} result - Utf8 string
*/
var hexToUtf8 = function hexToUtf8(data) {
    if (data === undefined) return data;
    var o = data;
    if (o && o.length > 2 && o[0] === 'f' && o[1] === 'e') {
        return "HEX: " + o.slice(2);
    }
    var result = void 0;
    try {
        result = decodeURIComponent(escape(_convert2.default.hex2a(o)));
    } catch (e) {
        //result = "Error, message not properly encoded !";
        result = _convert2.default.hex2a(o);
        console.log('invalid text input: ' + data);
    }
    //console.log(decodeURIComponent(escape( convert.hex2a(o) )));*/
    //result = convert.hex2a(o);
    return result;
};

/**
* Verify if message is not encrypted and return utf8
*
* @param {object} msg - A message object
*
* @return {string} result - Utf8 string
*/
var hexMessage = function hexMessage(msg) {
    if (msg === undefined) return msg;
    if (msg.type === 1) {
        return hexToUtf8(msg.payload);
    } else {
        return '';
    }
};

/**
* Split hex string into 64 characters segments
*
* @param {string} data - An hex string
*
* @return {array} - A segmented hex string
*/
var splitHex = function splitHex(data) {
    if (data === undefined) return data;
    var parts = data.match(/[\s\S]{1,64}/g) || [];
    var r = parts.join("\n");
    return r;
};

/**
 * Return mosaic name from mosaicId object
 *
 * @param {object} mosaicId - A mosaicId object
 *
 * @return {string} - The mosaic name
 */
var mosaicIdToName = function mosaicIdToName(mosaicId) {
    if (!mosaicId) return mosaicId;
    return mosaicId.namespaceId + ":" + mosaicId.name;
};

/**
 * Return the name of a transaction type id
 *
 * @param {number} id - A transaction type id
 *
 * @return {string} - The transaction type name
 */
var txTypeToName = function txTypeToName(id) {
    switch (id) {
        case _transactionTypes2.default.transfer:
            return 'Transfer';
        case _transactionTypes2.default.importanceTransfer:
            return 'ImportanceTransfer';
        case _transactionTypes2.default.multisigModification:
            return 'MultisigModification';
        case _transactionTypes2.default.provisionNamespace:
            return 'ProvisionNamespace';
        case _transactionTypes2.default.mosaicDefinition:
            return 'MosaicDefinition';
        case _transactionTypes2.default.mosaicSupply:
            return 'MosaicSupply';
        default:
            return 'Unknown_' + id;
    }
};

module.exports = {
    splitHex: splitHex,
    hexMessage: hexMessage,
    hexToUtf8: hexToUtf8,
    importanceTransferMode: importanceTransferMode,
    nemValue: nemValue,
    nemImportanceScore: nemImportanceScore,
    levyFee: levyFee,
    supplyRaw: supplyRaw,
    supply: supply,
    nemDate: nemDate,
    pubToAddress: pubToAddress,
    address: address,
    mosaicIdToName: mosaicIdToName,
    txTypeToName: txTypeToName
};
//# sourceMappingURL=format.js.map