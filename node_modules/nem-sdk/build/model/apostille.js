'use strict';

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _convert = require('../utils/convert');

var _convert2 = _interopRequireDefault(_convert);

var _keyPair = require('../crypto/keyPair');

var _keyPair2 = _interopRequireDefault(_keyPair);

var _address = require('../model/address');

var _address2 = _interopRequireDefault(_address);

var _sinks = require('../model/sinks');

var _sinks2 = _interopRequireDefault(_sinks);

var _objects = require('../model/objects');

var _objects2 = _interopRequireDefault(_objects);

var _transactions = require('../model/transactions');

var _transactions2 = _interopRequireDefault(_transactions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apostille hashing methods with version bytes
 *
 * @type {object}
 */
var hashing = {
    "MD5": {
        name: "MD5",
        signedVersion: "81",
        version: "01"
    },
    "SHA1": {
        name: "SHA1",
        signedVersion: "82",
        version: "02"
    },
    "SHA256": {
        name: "SHA256",
        signedVersion: "83",
        version: "03"
    },
    "SHA3-256": {
        name: "SHA3-256",
        signedVersion: "88",
        version: "08"
    },
    "SHA3-512": {
        name: "SHA3-512",
        signedVersion: "89",
        version: "09"
    }

    /**
     * Hash the file content depending of hashing
     *
     * @param {wordArray} data - File content
     * @param {object} hashing - The chosen hashing object
     * @param {boolean} isPrivate - True if apostille is private, false otherwise
     *
     * @return {string} - The file hash with checksum
     */
};var hashFileData = function hashFileData(data, hashing, isPrivate) {
    // Full checksum is 0xFE (added automatically if hex txes) + 0x4E + 0x54 + 0x59 + hashing version byte
    var checksum = void 0;
    // Append byte to checksum
    if (isPrivate) {
        checksum = "4e5459" + hashing.signedVersion;
    } else {
        checksum = "4e5459" + hashing.version;
    }
    // Build the apostille hash
    if (hashing.name === "MD5") {
        return checksum + _cryptoJs2.default.MD5(data);
    } else if (hashing.name === "SHA1") {
        return checksum + _cryptoJs2.default.SHA1(data);
    } else if (hashing.name === "SHA256") {
        return checksum + _cryptoJs2.default.SHA256(data);
    } else if (hashing.name === "SHA3-256") {
        return checksum + _cryptoJs2.default.SHA3(data, {
            outputLength: 256
        });
    } else {
        return checksum + _cryptoJs2.default.SHA3(data, {
            outputLength: 512
        });
    }
};

/**
 * Create an apostille object
 *
 * @param {object} common - A common object
 * @param {string} fileName - The file name (with extension)
 * @param {wordArray} fileContent - The file content
 * @param {string} tags - The apostille tags
 * @param {object} hashing - An hashing object
 * @param {boolean} isMultisig - True if transaction is multisig, false otherwise
 * @param {object} multisigAccount - An [AccountInfo]{@link https://bob.nem.ninja/docs/#accountInfo} object
 * @param {boolean} isPrivate - True if apostille is private / transferable / updateable, false if public
 * @param {number} network - A network id
 *
 * @return {object} - An apostille object containing apostille data and the prepared transaction ready to be sent
 */
var create = function create(common, fileName, fileContent, tags, hashing, isMultisig, multisigAccount, isPrivate, network) {
    var dedicatedAccount = {};
    var apostilleHash = void 0;
    //
    if (isPrivate) {
        // Create user keypair
        var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
        // Create the dedicated account
        dedicatedAccount = generateAccount(common, fileName, network);
        // Create hash from file content and selected hashing
        var hash = hashFileData(fileContent, hashing, isPrivate);
        // Get checksum
        var checksum = hash.substring(0, 8);
        // Get hash without checksum
        var dataHash = hash.substring(8);
        // Set checksum + signed hash as message
        apostilleHash = checksum + kp.sign(dataHash).toString();
    } else {
        // Use sink account
        dedicatedAccount.address = _sinks2.default.apostille[network].toUpperCase().replace(/-/g, '');
        // Set recipient private key
        dedicatedAccount.privateKey = "None (public sink)";
        // No signing we just put the hash in message
        apostilleHash = hashFileData(fileContent, hashing, isPrivate);
    }

    // Create transfer transaction object
    var transaction = _objects2.default.create("transferTransaction")(dedicatedAccount.address, 0, apostilleHash);
    // Multisig
    transaction.isMultisig = isMultisig;
    transaction.multisigAccount = multisigAccount;
    // Set message type to hexadecimal
    transaction.messageType = 0;
    // Prepare the transfer transaction object
    var transactionEntity = _transactions2.default.prepare("transferTransaction")(common, transaction, network);

    return {
        "data": {
            "file": {
                "name": fileName,
                "hash": apostilleHash.substring(8),
                "content": fileContent
            },
            "hash": "fe" + apostilleHash,
            "checksum": "fe" + apostilleHash.substring(0, 8),
            "dedicatedAccount": {
                "address": dedicatedAccount.address,
                "privateKey": dedicatedAccount.privateKey
            },
            "tags": tags
        },
        "transaction": transactionEntity
    };
};

/**
 * Verify an apostille
 *
 * @param {wordArray} fileContent - The file content
 * @param {object} apostilleTransaction - The transaction object for the apostille
 *
 * @return {boolean} - True if valid, false otherwise
 */
var verify = function verify(fileContent, apostilleTransaction) {
    var apostilleHash = void 0;
    if (apostilleTransaction.type === 4100) {
        apostilleHash = apostilleTransaction.otherTrans.message.payload;
    } else {
        apostilleHash = apostilleTransaction.message.payload;
    }
    // Get the checksum
    var checksum = apostilleHash.substring(0, 10);
    // Get the hashing byte
    var hashingByte = checksum.substring(8);
    // Retrieve the hashing method using the checksum in message and hash the file accordingly
    var fileHash = retrieveHash(apostilleHash, fileContent);
    // Check if apostille is signed
    if (isSigned(hashingByte)) {
        // Verify signature
        return _keyPair2.default.verifySignature(apostilleTransaction.signer, fileHash, apostilleHash.substring(10));
    } else {
        // Check if hashed file match hash in transaction (without checksum)
        return fileHash === apostilleHash.substring(10);
    }
};

/**
 * Hash a file according to version byte in checksum
 *
 * @param {string} apostilleHash - The hash contained in the apostille transaction
 * @param {wordArray} fileContent - The file content
 *
 * @return {string} - The file content hashed with correct hashing method
 */
var retrieveHash = function retrieveHash(apostilleHash, fileContent) {
    // Get checksum
    var checksum = apostilleHash.substring(0, 10);
    // Get the version byte
    var hashingVersionBytes = checksum.substring(8);
    // Hash depending of version byte
    if (hashingVersionBytes === "01" || hashingVersionBytes === "81") {
        return _cryptoJs2.default.MD5(fileContent).toString(_cryptoJs2.default.enc.Hex);
    } else if (hashingVersionBytes === "02" || hashingVersionBytes === "82") {
        return _cryptoJs2.default.SHA1(fileContent).toString(_cryptoJs2.default.enc.Hex);
    } else if (hashingVersionBytes === "03" || hashingVersionBytes === "83") {
        return _cryptoJs2.default.SHA256(fileContent).toString(_cryptoJs2.default.enc.Hex);
    } else if (hashingVersionBytes === "08" || hashingVersionBytes === "88") {
        return _cryptoJs2.default.SHA3(fileContent, { outputLength: 256 }).toString(_cryptoJs2.default.enc.Hex);
    } else {
        return _cryptoJs2.default.SHA3(fileContent, { outputLength: 512 }).toString(_cryptoJs2.default.enc.Hex);
    }
};

/**
 * Check if an apostille is signed
 *
 * @param {string} hashingByte - An hashing version byte
 *
 * @return {boolean} - True if signed, false otherwise
 */
var isSigned = function isSigned(hashingByte) {
    var array = Object.keys(hashing);
    for (var i = 0; array.length > i; i++) {
        if (hashing[array[i]].signedVersion === hashingByte) {
            return true;
        }
    }
    return false;
};

/**
 * Generate the dedicated account for a file. It will always generate the same private key for a given file name and private key
 *
 * @param {object} common - A common object
 * @param {string} fileName - The file name (with extension)
 * @param {number} network - A network id
 *
 * @return {object} - An object containing address and private key of the dedicated account
 */
var generateAccount = function generateAccount(common, fileName, network) {
    // Create user keypair
    var kp = _keyPair2.default.create(_helpers2.default.fixPrivateKey(common.privateKey));
    // Create recipient account from signed sha256 hash of new filename
    var signedFilename = kp.sign(_cryptoJs2.default.SHA256(fileName).toString(_cryptoJs2.default.enc.Hex)).toString();
    // Truncate signed file name to get a 32 bytes private key
    var dedicatedAccountPrivateKey = _helpers2.default.fixPrivateKey(signedFilename);
    // Create dedicated account key pair
    var dedicatedAccountKeyPair = _keyPair2.default.create(dedicatedAccountPrivateKey);
    return {
        "address": _address2.default.toAddress(dedicatedAccountKeyPair.publicKey.toString(), network),
        "privateKey": dedicatedAccountPrivateKey
    };
};

module.exports = {
    create: create,
    generateAccount: generateAccount,
    hashing: hashing,
    verify: verify,
    isSigned: isSigned
};
//# sourceMappingURL=apostille.js.map