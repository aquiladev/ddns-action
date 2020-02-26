'use strict';

var _keyPair = require('./keyPair');

var _keyPair2 = _interopRequireDefault(_keyPair);

var _convert = require('../utils/convert');

var _convert2 = _interopRequireDefault(_convert);

var _address = require('../model/address');

var _address2 = _interopRequireDefault(_address);

var _naclFast = require('../external/nacl-fast');

var _naclFast2 = _interopRequireDefault(_naclFast);

var _network = require('../model/network');

var _network2 = _interopRequireDefault(_network);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Encrypt a private key for mobile apps (AES_PBKF2)
 *
 * @param {string} password - A wallet password
 * @param {string} privateKey - An account private key
 *
 * @return {object} - The encrypted data
 */
var toMobileKey = function toMobileKey(password, privateKey) {
    // Errors
    if (!password || !privateKey) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
    // Processing
    var salt = _cryptoJs2.default.lib.WordArray.random(256 / 8);
    var key = _cryptoJs2.default.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 2000
    });
    var iv = _naclFast2.default.randomBytes(16);
    var encIv = {
        iv: _convert2.default.ua2words(iv, 16)
    };
    var encrypted = _cryptoJs2.default.AES.encrypt(_cryptoJs2.default.enc.Hex.parse(privateKey), key, encIv);
    // Result
    return {
        encrypted: _convert2.default.ua2hex(iv) + encrypted.ciphertext,
        salt: salt.toString()
    };
};

/**
 * Derive a private key from a password using count iterations of SHA3-256
 *
 * @param {string} password - A wallet password
 * @param {number} count - A number of iterations above 0
 *
 * @return {object} - The derived private key
 */
var derivePassSha = function derivePassSha(password, count) {
    // Errors
    if (!password) throw new Error('Missing argument !');
    if (!count || count <= 0) throw new Error('Please provide a count number above 0');
    // Processing
    var data = password;
    console.time('sha3^n generation time');
    for (var i = 0; i < count; ++i) {
        data = _cryptoJs2.default.SHA3(data, {
            outputLength: 256
        });
    }
    console.timeEnd('sha3^n generation time');
    // Result
    return {
        'priv': _cryptoJs2.default.enc.Hex.stringify(data)
    };
};

/**
 * Reveal the private key of an account or derive it from the wallet password
 *
 * @param {object} common- An object containing password and privateKey field
 * @param {object} walletAccount - A wallet account object
 * @param {string} algo - A wallet algorithm
 *
 * @return {object|boolean} - The account private key in and object or false
 */
var passwordToPrivatekey = function passwordToPrivatekey(common, walletAccount, algo) {
    // Errors
    if (!common || !walletAccount || !algo) throw new Error('Missing argument !');

    var r = undefined;

    if (algo === "trezor") {
        // HW wallet
        r = { 'priv': '' };
        common.isHW = true;
    } else if (!common.password) {
        throw new Error('Missing argument !');
    }

    // Processing
    if (algo === "pass:6k") {
        // Brain wallets
        if (!walletAccount.encrypted && !walletAccount.iv) {
            // Account private key is generated simply using a passphrase so it has no encrypted and iv
            r = derivePassSha(common.password, 6000);
        } else if (!walletAccount.encrypted || !walletAccount.iv) {
            // Else if one is missing there is a problem
            //console.log("Account might be compromised, missing encrypted or iv");
            return false;
        } else {
            // Else child accounts have encrypted and iv so we decrypt
            var pass = derivePassSha(common.password, 20);
            var obj = {
                ciphertext: _cryptoJs2.default.enc.Hex.parse(walletAccount.encrypted),
                iv: _convert2.default.hex2ua(walletAccount.iv),
                key: _convert2.default.hex2ua(pass.priv)
            };
            var d = decrypt(obj);
            r = { 'priv': d };
        }
    } else if (algo === "pass:bip32") {
        // Wallets from PRNG
        var _pass = derivePassSha(common.password, 20);
        var _obj = {
            ciphertext: _cryptoJs2.default.enc.Hex.parse(walletAccount.encrypted),
            iv: _convert2.default.hex2ua(walletAccount.iv),
            key: _convert2.default.hex2ua(_pass.priv)
        };
        var _d = decrypt(_obj);
        r = { 'priv': _d };
    } else if (algo === "pass:enc") {
        // Private Key wallets
        var _pass2 = derivePassSha(common.password, 20);
        var _obj2 = {
            ciphertext: _cryptoJs2.default.enc.Hex.parse(walletAccount.encrypted),
            iv: _convert2.default.hex2ua(walletAccount.iv),
            key: _convert2.default.hex2ua(_pass2.priv)
        };
        var _d2 = decrypt(_obj2);
        r = { 'priv': _d2 };
    } else if (!r) {
        //console.log("Unknown wallet encryption method");
        return false;
    }
    // Result
    common.privateKey = r.priv;
    return true;
};

/**
 * Check if a private key correspond to an account address
 *
 * @param {string} priv - An account private key
 * @param {number} network - A network id
 * @param {string} _expectedAddress - The expected NEM address
 *
 * @return {boolean} - True if valid, false otherwise
 */
var checkAddress = function checkAddress(priv, network, _expectedAddress) {
    // Errors
    if (!priv || !network || !_expectedAddress) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(priv)) throw new Error('Private key is not valid !');
    //Processing
    var expectedAddress = _expectedAddress.toUpperCase().replace(/-/g, '');
    var kp = _keyPair2.default.create(priv);
    var address = _address2.default.toAddress(kp.publicKey.toString(), network);
    // Result
    return address === expectedAddress;
};

function hashfunc(dest, data, dataLength) {
    var convertedData = _convert2.default.ua2words(data, dataLength);
    var hash = _cryptoJs2.default.SHA3(convertedData, {
        outputLength: 512
    });
    _convert2.default.words2ua(dest, hash);
}

function key_derive(shared, salt, sk, pk) {
    _naclFast2.default.lowlevel.crypto_shared_key_hash(shared, pk, sk, hashfunc);
    for (var i = 0; i < salt.length; i++) {
        shared[i] ^= salt[i];
    }
    var hash = _cryptoJs2.default.SHA3(_convert2.default.ua2words(shared, 32), {
        outputLength: 256
    });
    return hash;
}

/**
 * Generate a random key
 *
 * @return {Uint8Array} - A random key
 */
var randomKey = function randomKey() {
    var rkey = _naclFast2.default.randomBytes(32);
    return rkey;
};

/**
 * Encrypt hex data using a key
 *
 * @param {string} data - An hex string
 * @param {Uint8Array} key - An Uint8Array key
 *
 * @return {object} - The encrypted data
 */
var encrypt = function encrypt(data, key) {
    // Errors
    if (!data || !key) throw new Error('Missing argument !');
    // Processing
    var iv = _naclFast2.default.randomBytes(16);
    var encKey = _convert2.default.ua2words(key, 32);
    var encIv = {
        iv: _convert2.default.ua2words(iv, 16)
    };
    var encrypted = _cryptoJs2.default.AES.encrypt(_cryptoJs2.default.enc.Hex.parse(data), encKey, encIv);
    // Result
    return {
        ciphertext: encrypted.ciphertext,
        iv: iv,
        key: key
    };
};

/**
 * Decrypt data
 *
 * @param {object} data - An encrypted data object
 *
 * @return {string} - The decrypted hex string
 */
var decrypt = function decrypt(data) {
    // Errors
    if (!data) throw new Error('Missing argument !');
    // Processing
    var encKey = _convert2.default.ua2words(data.key, 32);
    var encIv = {
        iv: _convert2.default.ua2words(data.iv, 16)
    };
    // Result
    return _cryptoJs2.default.enc.Hex.stringify(_cryptoJs2.default.AES.decrypt(data, encKey, encIv));
};

/**
 * Encode a private key using a password
 *
 * @param {string} privateKey - An hex private key
 * @param {string} password - A password
 *
 * @return {object} - The encoded data
 */
var encodePrivKey = function encodePrivKey(privateKey, password) {
    // Errors
    if (!privateKey || !password) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
    // Processing
    var pass = derivePassSha(password, 20);
    var r = encrypt(privateKey, _convert2.default.hex2ua(pass.priv));
    // Result
    return {
        ciphertext: _cryptoJs2.default.enc.Hex.stringify(r.ciphertext),
        iv: _convert2.default.ua2hex(r.iv)
    };
};

/***
 * Encode a message, separated from encode() to help testing
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 * @param {Uint8Array} iv - An initialization vector
 * @param {Uint8Array} salt - A salt
 *
 * @return {string} - The encoded message
 */
var _encode = function _encode(senderPriv, recipientPub, msg, iv, salt) {
    // Errors
    if (!senderPriv || !recipientPub || !msg || !iv || !salt) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(senderPriv)) throw new Error('Private key is not valid !');
    if (!_helpers2.default.isPublicKeyValid(recipientPub)) throw new Error('Public key is not valid !');
    // Processing
    var sk = _convert2.default.hex2ua_reversed(senderPriv);
    var pk = _convert2.default.hex2ua(recipientPub);
    var shared = new Uint8Array(32);
    var r = key_derive(shared, salt, sk, pk);
    var encKey = r;
    var encIv = {
        iv: _convert2.default.ua2words(iv, 16)
    };
    var encrypted = _cryptoJs2.default.AES.encrypt(_cryptoJs2.default.enc.Hex.parse(_convert2.default.utf8ToHex(msg)), encKey, encIv);
    // Result
    var result = _convert2.default.ua2hex(salt) + _convert2.default.ua2hex(iv) + _cryptoJs2.default.enc.Hex.stringify(encrypted.ciphertext);
    return result;
};

/**
 * Encode a message
 *
 * @param {string} senderPriv - A sender private key
 * @param {string} recipientPub - A recipient public key
 * @param {string} msg - A text message
 *
 * @return {string} - The encoded message
 */
var encode = function encode(senderPriv, recipientPub, msg) {
    // Errors
    if (!senderPriv || !recipientPub || !msg) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(senderPriv)) throw new Error('Private key is not valid !');
    if (!_helpers2.default.isPublicKeyValid(recipientPub)) throw new Error('Public key is not valid !');
    // Processing
    var iv = _naclFast2.default.randomBytes(16);
    //console.log("IV:", convert.ua2hex(iv));
    var salt = _naclFast2.default.randomBytes(32);
    var encoded = _encode(senderPriv, recipientPub, msg, iv, salt);
    // Result
    return encoded;
};

/**
 * Decode an encrypted message payload
 *
 * @param {string} recipientPrivate - A recipient private key
 * @param {string} senderPublic - A sender public key
 * @param {string} _payload - An encrypted message payload
 *
 * @return {string} - The decoded payload as hex
 */
var decode = function decode(recipientPrivate, senderPublic, _payload) {
    // Errors
    if (!recipientPrivate || !senderPublic || !_payload) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(recipientPrivate)) throw new Error('Private key is not valid !');
    if (!_helpers2.default.isPublicKeyValid(senderPublic)) throw new Error('Public key is not valid !');
    // Processing
    var binPayload = _convert2.default.hex2ua(_payload);
    var salt = new Uint8Array(binPayload.buffer, 0, 32);
    var iv = new Uint8Array(binPayload.buffer, 32, 16);
    var payload = new Uint8Array(binPayload.buffer, 48);
    var sk = _convert2.default.hex2ua_reversed(recipientPrivate);
    var pk = _convert2.default.hex2ua(senderPublic);
    var shared = new Uint8Array(32);
    var r = key_derive(shared, salt, sk, pk);
    var encKey = r;
    var encIv = {
        iv: _convert2.default.ua2words(iv, 16)
    };
    var encrypted = {
        'ciphertext': _convert2.default.ua2words(payload, payload.length)
    };
    var plain = _cryptoJs2.default.AES.decrypt(encrypted, encKey, encIv);
    // Result
    var hexplain = _cryptoJs2.default.enc.Hex.stringify(plain);
    return hexplain;
};

module.exports = {
    toMobileKey: toMobileKey,
    derivePassSha: derivePassSha,
    passwordToPrivatekey: passwordToPrivatekey,
    checkAddress: checkAddress,
    randomKey: randomKey,
    decrypt: decrypt,
    encrypt: encrypt,
    encodePrivKey: encodePrivKey,
    _encode: _encode,
    encode: encode,
    decode: decode
};
//# sourceMappingURL=cryptoHelpers.js.map