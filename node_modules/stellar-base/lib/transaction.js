'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transaction = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _stellarXdr_generated = require('./generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _hashing = require('./hashing');

var _strkey = require('./strkey');

var _operation = require('./operation');

var _network = require('./network');

var _memo = require('./memo');

var _keypair = require('./keypair');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Use {@link TransactionBuilder} to build a transaction object, unless you have
 * an object or base64-encoded string of the transaction envelope XDR.
 * Once a Transaction has been created, its attributes and operations
 * should not be changed. You should only add signatures (using {@link Transaction#sign}) to a Transaction object before
 * submitting to the network or forwarding on to additional signers.
 * @constructor
 * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
 * @param {string} [networkPassphrase] passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
 */
var Transaction = exports.Transaction = function () {
  function Transaction(envelope, networkPassphrase) {
    _classCallCheck(this, Transaction);

    if (typeof envelope === 'string') {
      var buffer = Buffer.from(envelope, 'base64');
      envelope = _stellarXdr_generated2.default.TransactionEnvelope.fromXDR(buffer);
    }

    // Deprecation warning. TODO: remove optionality with next major release.
    if (networkPassphrase === null || networkPassphrase === undefined) {
      console.warn('Global `Network.current()` is deprecated. Please pass explicit argument instead, e.g. `new Transaction(envelope, Networks.PUBLIC)` (see https://git.io/fj9fG for more info).');
    } else if (typeof networkPassphrase !== 'string') {
      throw new Error('Invalid passphrase provided to Transaction: expected a string but got a ' + (typeof networkPassphrase === 'undefined' ? 'undefined' : _typeof(networkPassphrase)));
    }
    this._networkPassphrase = networkPassphrase;

    // since this transaction is immutable, save the tx
    this.tx = envelope.tx();
    this.source = _strkey.StrKey.encodeEd25519PublicKey(envelope.tx().sourceAccount().ed25519());
    this.fee = this.tx.fee();
    this._memo = this.tx.memo();
    this.sequence = this.tx.seqNum().toString();

    var timeBounds = this.tx.timeBounds();
    if (timeBounds) {
      this.timeBounds = {
        minTime: timeBounds.minTime().toString(),
        maxTime: timeBounds.maxTime().toString()
      };
    }

    var operations = this.tx.operations() || [];
    this.operations = (0, _map2.default)(operations, function (op) {
      return _operation.Operation.fromXDRObject(op);
    });

    var signatures = envelope.signatures() || [];
    this.signatures = (0, _map2.default)(signatures, function (s) {
      return s;
    });
  }

  _createClass(Transaction, [{
    key: 'sign',


    /**
     * Signs the transaction with the given {@link Keypair}.
     * @param {...Keypair} keypairs Keypairs of signers
     * @returns {void}
     */
    value: function sign() {
      var _this = this;

      var txHash = this.hash();

      for (var _len = arguments.length, keypairs = Array(_len), _key = 0; _key < _len; _key++) {
        keypairs[_key] = arguments[_key];
      }

      (0, _each2.default)(keypairs, function (kp) {
        var sig = kp.signDecorated(txHash);
        _this.signatures.push(sig);
      });
    }

    /**
     * Signs a transaction with the given {@link Keypair}. Useful if someone sends
     * you a transaction XDR for you to sign and return (see
     * {@link Transaction#addSignature} for how that works).
     *
     * When you get a transaction XDR to sign....
     * - Instantiate a `Transaction` object with the XDR
     * - Use {@link Keypair} to generate a keypair object for your Stellar seed.
     * - Run `getKeypairSignature` with that keypair
     * - Send back the signature along with your publicKey (not your secret seed!)
     *
     * Example:
     * ```javascript
     * // `transactionXDR` is a string from the person generating the transaction
     * const transaction = new Transaction(transactionXDR, networkPassphrase);
     * const keypair = Keypair.fromSecret(myStellarSeed);
     * return transaction.getKeypairSignature(keypair);
     * ```
     *
     * @param {Keypair} keypair Keypair of signer
     * @returns {string} Signature string
     */

  }, {
    key: 'getKeypairSignature',
    value: function getKeypairSignature(keypair) {
      return keypair.sign(this.hash()).toString('base64');
    }

    /**
     * Add a signature to the transaction. Useful when a party wants to pre-sign
     * a transaction but doesn't want to give access to their secret keys.
     * This will also verify whether the signature is valid.
     *
     * Here's how you would use this feature to solicit multiple signatures.
     * - Use `TransactionBuilder` to build a new transaction.
     * - Make sure to set a long enough timeout on that transaction to give your
     * signers enough time to sign!
     * - Once you build the transaction, use `transaction.toXDR()` to get the
     * base64-encoded XDR string.
     * - _Warning!_ Once you've built this transaction, don't submit any other
     * transactions onto your account! Doing so will invalidate this pre-compiled
     * transaction!
     * - Send this XDR string to your other parties. They can use the instructions
     * for {@link Transaction#getKeypairSignature} to sign the transaction.
     * - They should send you back their `publicKey` and the `signature` string
     * from {@link Transaction#getKeypairSignature}, both of which you pass to
     * this function.
     *
     * @param {string} publicKey The public key of the signer
     * @param {string} signature The base64 value of the signature XDR
     * @returns {TransactionBuilder}
     */

  }, {
    key: 'addSignature',
    value: function addSignature() {
      var publicKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var signature = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (!signature || typeof signature !== 'string') {
        throw new Error('Invalid signature');
      }

      if (!publicKey || typeof publicKey !== 'string') {
        throw new Error('Invalid publicKey');
      }

      var keypair = void 0;
      var hint = void 0;
      var signatureBuffer = Buffer.from(signature, 'base64');

      try {
        keypair = _keypair.Keypair.fromPublicKey(publicKey);
        hint = keypair.signatureHint();
      } catch (e) {
        throw new Error('Invalid publicKey');
      }

      if (!keypair.verify(this.hash(), signatureBuffer)) {
        throw new Error('Invalid signature');
      }

      this.signatures.push(new _stellarXdr_generated2.default.DecoratedSignature({
        hint: hint,
        signature: signatureBuffer
      }));
    }

    /**
     * Add `hashX` signer preimage as signature.
     * @param {Buffer|String} preimage Preimage of hash used as signer
     * @returns {void}
     */

  }, {
    key: 'signHashX',
    value: function signHashX(preimage) {
      if ((0, _isString2.default)(preimage)) {
        preimage = Buffer.from(preimage, 'hex');
      }

      if (preimage.length > 64) {
        throw new Error('preimage cannnot be longer than 64 bytes');
      }

      var signature = preimage;
      var hashX = (0, _hashing.hash)(preimage);
      var hint = hashX.slice(hashX.length - 4);
      this.signatures.push(new _stellarXdr_generated2.default.DecoratedSignature({ hint: hint, signature: signature }));
    }

    /**
     * Returns a hash for this transaction, suitable for signing.
     * @returns {Buffer}
     */

  }, {
    key: 'hash',
    value: function hash() {
      return (0, _hashing.hash)(this.signatureBase());
    }

    /**
     * Returns the "signature base" of this transaction, which is the value
     * that, when hashed, should be signed to create a signature that
     * validators on the Stellar Network will accept.
     *
     * It is composed of a 4 prefix bytes followed by the xdr-encoded form
     * of this transaction.
     * @returns {Buffer}
     */

  }, {
    key: 'signatureBase',
    value: function signatureBase() {
      return Buffer.concat([(0, _hashing.hash)(this.networkPassphrase), _stellarXdr_generated2.default.EnvelopeType.envelopeTypeTx().toXDR(), this.tx.toXDR()]);
    }

    /**
     * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
     * @returns {xdr.TransactionEnvelope}
     */

  }, {
    key: 'toEnvelope',
    value: function toEnvelope() {
      var tx = this.tx;
      var signatures = this.signatures;
      var envelope = new _stellarXdr_generated2.default.TransactionEnvelope({ tx: tx, signatures: signatures });

      return envelope;
    }

    /**
     * Get the transaction envelope as a base64-encoded string
     * @returns {string} XDR string
     */

  }, {
    key: 'toXDR',
    value: function toXDR() {
      return this.toEnvelope().toXDR().toString('base64');
    }
  }, {
    key: 'networkPassphrase',
    get: function get() {
      if (this._networkPassphrase) {
        return this._networkPassphrase;
      }

      console.warn('Global `Network.current()` is deprecated. Please pass explicit argument instead, e.g. `new Transaction(envelope, Networks.PUBLIC)` (see https://git.io/fj9fG for more info).');

      if (_network.Network.current() === null) {
        throw new Error('No network selected. Please pass a network argument, e.g. `new Transaction(envelope, Networks.PUBLIC)`.');
      }

      return _network.Network.current().networkPassphrase();
    },
    set: function set(networkPassphrase) {
      this._networkPassphrase = networkPassphrase;
    }
  }, {
    key: 'memo',
    get: function get() {
      return _memo.Memo.fromXDRObject(this._memo);
    },
    set: function set(value) {
      throw new Error('Transaction is immutable');
    }
  }]);

  return Transaction;
}();