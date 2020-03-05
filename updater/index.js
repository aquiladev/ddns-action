const core = require('@actions/core');

const ensFactory = require('./ens');
const CNS = require('./cns');

const tldMap = [
  { name: '.eth', factory: ensFactory },
  { name: '.crypto', factory: (options) => { return new CNS(options) } }
]

function validate({ name, contentHash }) {
  if (!name) {
    throw new Error('Name is unknown or empty');
  }

  if (!tldMap.find(tld => name.endsWith(tld.name))) {
    throw new Error('Not supported TLD');
  }

  if (!contentHash) {
    throw new Error('ContentHash is unknown or empty');
  }
}

module.exports = {
  async update(options) {
    validate(options);

    const { name, contentHash } = options;
    const factory = tldMap.find(tld => name.endsWith(tld.name));
    const updater = await factory(options);

    let currentContenthash;
    try {
      currentContenthash = await updater.getContenthash();
      if (currentContenthash.hash === contentHash) {
        console.log(`IPFS hash is up to date, update is not needed ${currentContenthash.hash}`);
        return;
      }
    } catch (error) {
      core.warning(error);
    }

    return updater.setContenthash({ contentType: 'ipfs-ns', contentHash });
  }
}