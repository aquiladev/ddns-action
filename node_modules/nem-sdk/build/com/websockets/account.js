'use strict';

var _sockjs = require('../../external/sockjs-0.3.4');

var _sockjsClient = require('sockjs-client');

var _sockjsClient2 = _interopRequireDefault(_sockjsClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Check if socket is open
 *
 * @param {object} connector - A connector object
 *
 * @return {boolean} - True if open, false otherwise
 */
var checkReadyState = function checkReadyState(connector) {
    var self = connector;
    if (_sockjs.SockJS ? self.socket.readyState !== _sockjs.SockJS.OPEN : self.socket.readyState !== _sockjsClient2.default.OPEN) {
        return false;
    }
    return true;
};

/**
 * Request the account data of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
var requestAccountData = function requestAccountData(connector, address) {
    var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function () {
            requestAccountData(connector, address);
        }, 100);
    } else {
        // Use address if provided
        var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/get", {}, "{'account':'" + _address + "'}");
    }
};

/**
 * Request the recent transactions of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
var requestRecentTransactions = function requestRecentTransactions(connector, address) {
    var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function () {
            requestRecentTransactions(connector, address);
        }, 100);
    } else {
        // Use address if provided
        var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/transfers/all", {}, "{'account':'" + _address + "'}");
    }
};

/**
 * Request the owned mosaic definitions of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
var requestMosaicDefinitions = function requestMosaicDefinitions(connector, address) {
    var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function () {
            requestMosaicDefinitions(connector, address);
        }, 100);
    } else {
        // Use address if provided
        var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/mosaic/owned/definition", {}, "{'account':'" + _address + "'}");
    }
};

/**
 * Request the owned mosaics of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
var requestMosaics = function requestMosaics(connector, address) {
    var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function () {
            requestMosaics(connector, address);
        }, 100);
    } else {
        // Use address if provided
        var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/mosaic/owned", {}, "{'account':'" + _address + "'}");
    }
};

/**
 * Request the owned namespaces of the address in the given connector
 * You can optionally use an address directly to request data for a specific account
 *
 * @param {object} connector - A connector object
 * @param {string} address - A NEM account address (optional)
 *
 * @return the response in the subscription callback
 */
var requestNamespaces = function requestNamespaces(connector, address) {
    var self = connector;
    // If not ready, wait a bit more...
    if (!checkReadyState(connector)) {
        self.timeoutHandle = setTimeout(function () {
            requestNamespaces(connector, address);
        }, 100);
    } else {
        // Use address if provided
        var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
        self.stompClient.send("/w/api/account/namespace/owned", {}, "{'account':'" + _address + "'}");
    }
};

/**
 * Subscribe to the account data channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeAccountData = function subscribeAccountData(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/' + _address, function (data) {
        callback(JSON.parse(data.body));
    });
};

/**
 * Subscribe to the recent transactions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeRecentTransactions = function subscribeRecentTransactions(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/recenttransactions/' + _address, function (data) {
        callback(JSON.parse(data.body));
    });
};

/**
 * Subscribe to the unconfirmed transactions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeUnconfirmedTransactions = function subscribeUnconfirmedTransactions(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/unconfirmed/' + _address, function (data) {
        callback(JSON.parse(data.body));
    });
};

/**
 * Subscribe to the confirmed transactions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeConfirmedTransactions = function subscribeConfirmedTransactions(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/transactions/' + _address, function (data) {
        callback(JSON.parse(data.body));
    });
};

/**
 * Subscribe to the mosaic definitions channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeMosaicDefinitions = function subscribeMosaicDefinitions(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/mosaic/owned/definition/' + _address, function (data) {
        callback(JSON.parse(data.body));
    });
};

/**
 * Subscribe to the owned mosaics channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeMosaics = function subscribeMosaics(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/mosaic/owned/' + _address, function (data) {
        callback(JSON.parse(data.body), _address);
    });
};

/**
 * Subscribe to the owned namespaces channel for the address in the given connector 
 *
 * @param {object} connector - A connector object
 * @param {function} callback - A callback function where data will be received
 * @param {string} address - A NEM account address (optional)
 *
 * @return the received data in the callback
 */
var subscribeNamespaces = function subscribeNamespaces(connector, callback, address) {
    var self = connector;
    if (!checkReadyState(connector)) {
        return false;
    }
    // Use address if provided
    var _address = undefined !== address ? address.replace(/-/g, "").toUpperCase() : self.address;
    self.stompClient.subscribe('/account/namespace/owned/' + _address, function (data) {
        callback(JSON.parse(data.body), _address);
    });
};

module.exports = {
    requests: {
        data: requestAccountData,
        transactions: {
            recent: requestRecentTransactions
        },
        mosaics: {
            owned: requestMosaics,
            definitions: requestMosaicDefinitions
        },
        namespaces: {
            owned: requestNamespaces
        }
    },
    subscribe: {
        data: subscribeAccountData,
        transactions: {
            recent: subscribeRecentTransactions,
            confirmed: subscribeConfirmedTransactions,
            unconfirmed: subscribeUnconfirmedTransactions
        },
        mosaics: {
            owned: subscribeMosaics,
            definitions: subscribeMosaicDefinitions
        },
        namespaces: {
            owned: subscribeNamespaces
        }
    }
};
//# sourceMappingURL=account.js.map