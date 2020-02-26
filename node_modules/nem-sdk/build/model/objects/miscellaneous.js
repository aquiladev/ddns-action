"use strict";

/**
 * An endpoint object
 *
 * @param {string} host - A NIS uri
 * @param {number} port - A port
 *
 * @return {object}
 */
var endpoint = function endpoint(host, port) {
    return {
        "host": host || "",
        "port": port || ""
    };
};

/**
 * A common object
 *
 * @param {string} password - A password
 * @param {string} privateKey - A privateKey
 * @param {boolean} isHW - True if hardware wallet, false otherwise
 *
 * @return {object}
 */
var common = function common(password, privateKey, isHW) {
    return {
        "password": password || "",
        "privateKey": privateKey || "",
        "isHW": isHW || false
    };
};

/**
 * Contains message types with name
 *
 * @return {array}
 */
var messageTypes = function messageTypes() {
    return [{
        "value": 0,
        "name": "Hexadecimal"
    }, {
        "value": 1,
        "name": "Unencrypted"
    }, {
        "value": 2,
        "name": "Encrypted"
    }];
};

/**
 * A multisig cosignatory modification object
 *
 * @param {number} type - 1 if an addition, 2 if deletion
 * @param {string} publicKey - An account public key
 *
 * @return {object}
 */
var multisigCosignatoryModification = function multisigCosignatoryModification(type, publicKey) {
    return {
        "modificationType": type || 1,
        "cosignatoryAccount": publicKey
    };
};

module.exports = {
    endpoint: endpoint,
    common: common,
    messageTypes: messageTypes,
    multisigCosignatoryModification: multisigCosignatoryModification
};
//# sourceMappingURL=miscellaneous.js.map