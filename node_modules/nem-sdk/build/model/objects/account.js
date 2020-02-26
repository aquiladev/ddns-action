"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (address, label, child, encrypted, iv) {
    return {
        "address": address || "",
        "label": label || "",
        "child": child || "",
        "encrypted": encrypted || "",
        "iv": iv || ""
    };
};
//# sourceMappingURL=account.js.map