'use strict';

/**
 * An url encoded header
 *
 * @type {object}
 */
var urlEncoded = {
  'Content-Type': 'application/x-www-form-urlencoded'

  /**
   * Create an application/json header
   *
   * @param {data} - A json string
   *
   * @return {object} - An application/json header with content length
   */
};var json = function json(data) {
  return {
    "Content-Type": "application/json",
    "Content-Length": Buffer.from(data).byteLength
  };
};

module.exports = {
  urlEncoded: urlEncoded,
  json: json
};
//# sourceMappingURL=headers.js.map