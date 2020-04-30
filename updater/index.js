const core = require('@actions/core');

const ensFactory = require('./ens');
const CNS = require('./cns');

const supportedTypes = ['ipfs-ns', 'swarm-ns'];

const tldMap = [
  { name: '.eth', factory: ensFactory },
  { name: '.crypto', factory: (options) => { return new CNS(options) } }
]

function validate({ name, contentHash, contentType }) {
  if (!name) {
    throw new Error('Name is unknown or empty');
  }

  if (!tldMap.find(tld => name.endsWith(tld.name))) {
    throw new Error('Not supported TLD');
  }

  if (!contentHash) {
    throw new Error('ContentHash is unknown or empty');
  }

  if (!supportedTypes.find(type => type === contentType)) {
    throw new Error('ContentType is not supported');
  }
}

module.exports = {
  async update(options) {
    validate(options);

    const { name, contentHash, contentType, verbose } = options;
    const { factory } = tldMap.find(tld => name.endsWith(tld.name));
    const updater = await factory(options);

    let current;
    try {
      current = await updater.getContenthash();
      if (current.hash === contentHash) {
        console.log(`Content hash is up to date. [${current.hash}]`);
        return;
      }
    } catch (error) {
      core.warning(error);
    }

    const result = await updater.setContenthash({ contentType, contentHash })
      .catch((err) => { throw err; });
    if (verbose) {
      console.log(`Tx hash ${result}`);
    }

    return result;
  }
}