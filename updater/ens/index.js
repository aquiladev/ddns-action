const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const Updater = require('@triplespeeder/ens-updater/lib');

module.exports = async (options) => {
  const { mnemonic, rpc, name, gasPrice, dryrun, verbose } = options;
  const provider = new HDWalletProvider(mnemonic, rpc);
  const web3 = new Web3(provider);

  const updaterOptions = {
    web3,
    ensName: name,
    controllerAddress: provider.addresses[0],
    gasPrice,
    dryrun,
    verbose: verbose || false
  };
  const updater = new Updater();
  await updater.setup(updaterOptions);
  return updater;
}