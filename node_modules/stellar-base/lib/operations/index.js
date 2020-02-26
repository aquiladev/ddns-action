'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPassiveSellOffer = exports.manageSellOffer = exports.setOptions = exports.payment = exports.pathPaymentStrictSend = exports.pathPaymentStrictReceive = exports.pathPayment = exports.manageBuyOffer = exports.manageData = exports.inflation = exports.createAccount = exports.changeTrust = exports.bumpSequence = exports.allowTrust = exports.accountMerge = undefined;

var _account_merge = require('./account_merge');

Object.defineProperty(exports, 'accountMerge', {
  enumerable: true,
  get: function get() {
    return _account_merge.accountMerge;
  }
});

var _allow_trust = require('./allow_trust');

Object.defineProperty(exports, 'allowTrust', {
  enumerable: true,
  get: function get() {
    return _allow_trust.allowTrust;
  }
});

var _bump_sequence = require('./bump_sequence');

Object.defineProperty(exports, 'bumpSequence', {
  enumerable: true,
  get: function get() {
    return _bump_sequence.bumpSequence;
  }
});

var _change_trust = require('./change_trust');

Object.defineProperty(exports, 'changeTrust', {
  enumerable: true,
  get: function get() {
    return _change_trust.changeTrust;
  }
});

var _create_account = require('./create_account');

Object.defineProperty(exports, 'createAccount', {
  enumerable: true,
  get: function get() {
    return _create_account.createAccount;
  }
});

var _inflation = require('./inflation');

Object.defineProperty(exports, 'inflation', {
  enumerable: true,
  get: function get() {
    return _inflation.inflation;
  }
});

var _manage_data = require('./manage_data');

Object.defineProperty(exports, 'manageData', {
  enumerable: true,
  get: function get() {
    return _manage_data.manageData;
  }
});

var _manage_buy_offer = require('./manage_buy_offer');

Object.defineProperty(exports, 'manageBuyOffer', {
  enumerable: true,
  get: function get() {
    return _manage_buy_offer.manageBuyOffer;
  }
});

var _path_payment = require('./path_payment');

Object.defineProperty(exports, 'pathPayment', {
  enumerable: true,
  get: function get() {
    return _path_payment.pathPayment;
  }
});

var _path_payment_strict_receive = require('./path_payment_strict_receive');

Object.defineProperty(exports, 'pathPaymentStrictReceive', {
  enumerable: true,
  get: function get() {
    return _path_payment_strict_receive.pathPaymentStrictReceive;
  }
});

var _path_payment_strict_send = require('./path_payment_strict_send');

Object.defineProperty(exports, 'pathPaymentStrictSend', {
  enumerable: true,
  get: function get() {
    return _path_payment_strict_send.pathPaymentStrictSend;
  }
});

var _payment = require('./payment');

Object.defineProperty(exports, 'payment', {
  enumerable: true,
  get: function get() {
    return _payment.payment;
  }
});

var _set_options = require('./set_options');

Object.defineProperty(exports, 'setOptions', {
  enumerable: true,
  get: function get() {
    return _set_options.setOptions;
  }
});
exports.manageOffer = manageOffer;
exports.createPassiveOffer = createPassiveOffer;

var _manage_sell_offer = require('./manage_sell_offer');

var _create_passive_sell_offer = require('./create_passive_sell_offer');

exports.manageSellOffer = _manage_sell_offer.manageSellOffer;
exports.createPassiveSellOffer = _create_passive_sell_offer.createPassiveSellOffer;
function manageOffer(opts) {
  // eslint-disable-next-line no-console
  console.log('[Operation] Operation.manageOffer has been renamed to Operation.manageSellOffer! The old name is deprecated and will be removed in a later version!');

  return _manage_sell_offer.manageSellOffer.call(this, opts);
}

function createPassiveOffer(opts) {
  // eslint-disable-next-line no-console
  console.log('[Operation] Operation.createPassiveOffer has been renamed to Operation.createPassiveSellOffer! The old name is deprecated and will be removed in a later version!');

  return _create_passive_sell_offer.createPassiveSellOffer.call(this, opts);
}