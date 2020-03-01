const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const Updater = require('@triplespeeder/ens-updater/lib');
const core = require('@actions/core');

module.exports = {
  async update(mnemonic, rpc, name, contentHash, verbose) {
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