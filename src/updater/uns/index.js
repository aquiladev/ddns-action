const { ethers } = require('ethers');
const NetworkConfig = require('uns/uns-config.json');
const UNSRegistryABI = require('uns/artifacts/abi/UNSRegistry.json');

const { namehash } = require('../../utils/namehash');

const ipfsKey = 'ipfs.html.value';

function UNS(options) {
  const { mnemonic, rpc, name, dryrun, verbose } = options;

  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const getRegistryContract = async () => {
    const { chainId } = await provider.getNetwork();
    const { contracts } = NetworkConfig.networks[chainId];
    const { address } = contracts.UNSRegistry;
    return new ethers.Contract(address, UNSRegistryABI, provider);
  }

  this.getContenthash = async () => {
    if (verbose) {
      console.log('Getting content...')
    }

    const registryContract = await getRegistryContract();
    return registryContract.get(ipfsKey, namehash(name));
  }

  this.setContenthash = async ({ contentHash, contentType }) => {
    if (contentType !== 'ipfs-ns') {
      throw new Error('ContentType is not supported. UNS supports only ipfs-ns');
    }

    const registryContract = await getRegistryContract();
    const account = new ethers.Wallet(mnemonic, provider);

    if (dryrun) {
      return;
    }

    return registryContract.connect(account)
      .set(ipfsKey, contentHash, namehash(name));
  }
}

module.exports = UNS;
