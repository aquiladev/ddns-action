const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const Updater = require('@triplespeeder/ens-updater/lib');
const core = require('@actions/core');

const tldMap = [
  { name: '.eth', factory: createEthUpdater }
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

async function createEthUpdater(options) {
  const { mnemonic, rpc, name, verbose } = options;
  const provider = new HDWalletProvider(mnemonic, rpc);
  const web3 = new Web3(provider);

  const updaterOptions = {
    web3,
    ensName: name,
    controllerAddress: provider.addresses[0],
    verbose: verbose || false,
    dryrun: false
  };
  const updater = new Updater();
  await updater.setup(updaterOptions);
  return updater;
}

module.exports = {
  async update(options) {
    validate(options);

    const { name, contentHash } = options;
    const factory = tldMap.find(tld => name.endsWith(tld.name));
    const updater = factory(options);

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