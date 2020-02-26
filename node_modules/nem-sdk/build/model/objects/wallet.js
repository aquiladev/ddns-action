"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (walletName, addr, brain, algo, encrypted, network) {
    return {
        "name": walletName,
        "accounts": {
            "0": {
                "brain": brain,
                "algo": algo,
                "encrypted": encrypted.ciphertext || "",
                "iv": encrypted.iv || "",
                "address": addr.toUpperCase().replace(/-/g, ''),
                "label": 'Primary',
                "network": network
            }
        }
    };
};
//# sourceMappingURL=wallet.js.map