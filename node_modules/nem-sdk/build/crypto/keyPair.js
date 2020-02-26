'use strict';

var _naclFast = require('../external/nacl-fast');

var _naclFast2 = _interopRequireDefault(_naclFast);

var _convert = require('../utils/convert');

var _convert2 = _interopRequireDefault(_convert);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***
* Create a BinaryKey object
*
* @param {Uint8Array} keyData - A key data
*/
var BinaryKey = function BinaryKey(keyData) {
    this.data = keyData;
    this.toString = function () {
        return _convert2.default.ua2hex(this.data);
    };
};

var hashfunc = function hashfunc(dest, data, dataLength) {
    var convertedData = _convert2.default.ua2words(data, dataLength);
    var hash = _cryptoJs2.default.SHA3(convertedData, {
        outputLength: 512
    });
    _convert2.default.words2ua(dest, hash);
};

/***
* Create an hasher object
*/
var hashobj = function hashobj() {
    this.sha3 = _cryptoJs2.default.algo.SHA3.create({
        outputLength: 512
    });
    this.reset = function () {
        this.sha3 = _cryptoJs2.default.algo.SHA3.create({
            outputLength: 512
        });
    };

    this.update = function (data) {
        if (data instanceof BinaryKey) {
            var converted = _convert2.default.ua2words(data.data, data.data.length);
            var result = _cryptoJs2.default.enc.Hex.stringify(converted);
            this.sha3.update(converted);
        } else if (data instanceof Uint8Array) {
            var _converted = _convert2.default.ua2words(data, data.length);
            this.sha3.update(_converted);
        } else if (typeof data === "string") {
            var _converted2 = _cryptoJs2.default.enc.Hex.parse(data);
            this.sha3.update(_converted2);
        } else {
            throw new Error("unhandled argument");
        }
    };

    this.finalize = function (result) {
        var hash = this.sha3.finalize();
        _convert2.default.words2ua(result, hash);
    };
};

/***
* Create a KeyPair Object 
*
* @param {string} privkey - An hex private key
*/
var KeyPair = function KeyPair(privkey) {
    var _this = this;

    this.publicKey = new BinaryKey(new Uint8Array(_naclFast2.default.lowlevel.crypto_sign_PUBLICKEYBYTES));
    this.secretKey = _convert2.default.hex2ua_reversed(privkey);
    _naclFast2.default.lowlevel.crypto_sign_keypair_hash(this.publicKey.data, this.secretKey, hashfunc);

    // Signature
    this.sign = function (data) {
        var sig = new Uint8Array(64);
        var hasher = new hashobj();
        var r = _naclFast2.default.lowlevel.crypto_sign_hash(sig, _this, data, hasher);
        if (!r) {
            alert("Couldn't sign the tx, generated invalid signature");
            throw new Error("Couldn't sign the tx, generated invalid signature");
        }
        return new BinaryKey(sig);
    };
};

/**
* Create a NEM KeyPair
*
* @param {string} hexdata - An hex private key
*
* @return {object} - The NEM KeyPair object
*/
var create = function create(hexdata) {
    // Errors
    if (!hexdata) throw new Error('Missing argument !');
    if (!_helpers2.default.isPrivateKeyValid(hexdata)) throw new Error('Private key is not valid !');
    // Processing
    var r = new KeyPair(hexdata);
    // Result
    return r;
};

/**
 * Verify a signature.
 *
 * @param {string} publicKey - The public key to use for verification.
 * @param {string} data - The data to verify.
 * @param {string} signature - The signature to verify.
 *
 * @return {boolean}  - True if the signature is valid, false otherwise.
 */
var verifySignature = function verifySignature(publicKey, data, signature) {
    // Errors
    if (!publicKey || !data || !signature) throw new Error('Missing argument !');
    if (!_helpers2.default.isPublicKeyValid(publicKey)) throw new Error('Public key is not valid !');

    if (!_helpers2.default.isHexadecimal(signature)) {
        //console.error('Signature must be hexadecimal only !');
        return false;
    }
    if (signature.length !== 128) {
        //console.error('Signature length is incorrect !') 
        return false;
    }

    // Create an hasher object
    var hasher = new hashobj();
    // Convert public key to Uint8Array
    var _pk = _convert2.default.hex2ua(publicKey);
    // Convert signature to Uint8Array
    var _signature = _convert2.default.hex2ua(signature);

    var c = _naclFast2.default;
    var p = [c.gf(), c.gf(), c.gf(), c.gf()];
    var q = [c.gf(), c.gf(), c.gf(), c.gf()];

    if (c.unpackneg(q, _pk)) return false;

    var h = new Uint8Array(64);
    hasher.reset();
    hasher.update(_signature.subarray(0, 64 / 2));
    hasher.update(_pk);
    hasher.update(data);
    hasher.finalize(h);

    c.reduce(h);
    c.scalarmult(p, q, h);

    var t = new Uint8Array(64);
    c.scalarbase(q, _signature.subarray(64 / 2));
    c.add(p, q);
    c.pack(t, p);

    return 0 === _naclFast2.default.lowlevel.crypto_verify_32(_signature, 0, t, 0);
};

module.exports = {
    create: create,
    verifySignature: verifySignature
};
//# sourceMappingURL=keyPair.js.map