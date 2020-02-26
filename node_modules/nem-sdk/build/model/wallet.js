'use strict';

var _naclFast = require('../external/nacl-fast');

var _naclFast2 = _interopRequireDefault(_naclFast);

var _convert = require('../utils/convert');

var _convert2 = _interopRequireDefault(_convert);

var _helpers = require('../utils/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _keyPair = require('../crypto/keyPair');

var _keyPair2 = _interopRequireDefault(_keyPair);

var _cryptoHelpers = require('../crypto/cryptoHelpers');

var _cryptoHelpers2 = _interopRequireDefault(_cryptoHelpers);

var _address = require('../model/address');

var _address2 = _interopRequireDefault(_address);

var _objects = require('./objects');

var _objects2 = _interopRequireDefault(_objects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a wallet containing a private key generated using a Pseudo Random Number Generator
 *
 * @param {string} walletName - The wallet name
 * @param {string} password - The wallet password
 * @param {number} network - The network id
 *
 * @return {object} - A PRNG wallet object
 */
var createPRNG = function createPRNG(walletName, password, network) {
    if (!walletName.length || !password.length || !network) throw new Error('A parameter is missing !');
    // Generate keypair from random private key
    var privateKey = _convert2.default.ua2hex(_naclFast2.default.randomBytes(32));
    var kp = _keyPair2.default.create(privateKey);
    // Create address from public key
    var addr = _address2.default.toAddress(kp.publicKey.toString(), network);
    // Encrypt private key using password
    var encrypted = _cryptoHelpers2.default.encodePrivKey(privateKey, password);
    return _objects2.default.create("wallet")(walletName, addr, true, "pass:bip32", encrypted, network);
};

/**
 * Create a wallet containing a private key generated using a derived passphrase
 *
 * @param {string} walletName - The wallet name
 * @param {string} passphrase - The wallet passphrase
 * @param {number} network - The network id
 *
 * @return {object} - A Brain wallet object
 */
var createBrain = function createBrain(walletName, passphrase, network) {
    if (!walletName.length || !passphrase.length || !network) throw new Error('A parameter is missing !');
    var privateKey = _cryptoHelpers2.default.derivePassSha(passphrase, 6000).priv;
    var kp = _keyPair2.default.create(privateKey);
    // Create address from public key
    var addr = _address2.default.toAddress(kp.publicKey.toString(), network);
    return _objects2.default.create("wallet")(walletName, addr, true, "pass:6k", "", network);
};

/**
 * Create a wallet containing any private key
 *
 * @param {string} walletName - The wallet name
 * @param {string} password - The wallet passphrase
 * @param {string} privateKey - The private key to import
 * @param {number} network - The network id
 *
 * @return {object} - A private key wallet object
 */
var importPrivateKey = function importPrivateKey(walletName, password, privateKey, network) {
    if (!walletName.length || !password.length || !network || !privateKey) throw new Error('A parameter is missing !');
    if (!_helpers2.default.isPrivateKeyValid(privateKey)) throw new Error('Private key is not valid !');
    // Create address from private key
    var kp = _keyPair2.default.create(privateKey);
    var addr = _address2.default.toAddress(kp.publicKey.toString(), network);
    // Encrypt private key using password
    var encrypted = _cryptoHelpers2.default.encodePrivKey(privateKey, password);
    return _objects2.default.create("wallet")(walletName, addr, false, "pass:enc", encrypted, network);
};

module.exports = {
    createPRNG: createPRNG,
    createBrain: createBrain,
    importPrivateKey: importPrivateKey
};
//# sourceMappingURL=wallet.js.map