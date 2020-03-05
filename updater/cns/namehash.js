const { keccak_256: sha3 } = require('js-sha3');

function namehash(domain, parent, prefix = true) {
  parent = parent || '0000000000000000000000000000000000000000000000000000000000000000';
  const assembledHash = [parent].concat(domain
    .split('.')
    .reverse()
    .filter(label => label))
    .reduce((parent, label) => childhash(parent, label, { prefix: false }));
  return prefix ? '0x' + assembledHash : assembledHash;
}

function childhash(parent, label, options = { prefix: true }) {
  parent = parent.replace(/^0x/, '');
  const childHash = sha3(label);
  const mynode = sha3(Buffer.from(parent + childHash, 'hex'));
  return (options.prefix ? '0x' : '') + mynode;
}

module.exports = {
  namehash,
  childhash
};