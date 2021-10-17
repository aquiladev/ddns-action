const { ethers } = require('ethers');
const NetworkConfig = require('uns/uns-config.json');

const registryABI = require('./registry.json');
const resolverABI = require('./resolver.json');
const { namehash } = require('../../utils/namehash');

const ipfsKey = 'ipfs.html.value';

function CNS(options) {
  const { mnemonic, rpc, name, dryrun, verbose } = options;

  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const getResolver = async (tokenId) => {
    const { chainId } = await provider.getNetwork();
    const { contracts } = NetworkConfig.networks[chainId];
    const { address } = contracts.CNSRegistry;
    const registryContract = new ethers.Contract(address, registryABI, provider);
    return registryContract.resolverOf(tokenId);
  }

  const getResolverContract = async (tokenId) => {
    let resolver;
    try {
      resolver = await getResolver(tokenId);
    } catch (error) {
      if (verbose) {
        console.error(error);
      }
      throw new Error('Resolver not found');
    }

    return new ethers.Contract(resolver, resolverABI, provider);
  }

  this.getContenthash = async () => {
    if (verbose) {
      console.log('Getting content...')
    }

    const tokenId = namehash(name);
    const resolverContract = await getResolverContract(tokenId);

    return resolverContract.get(ipfsKey, tokenId);
  }

  this.setContenthash = async ({ contentHash, contentType }) => {
    if (contentType !== 'ipfs-ns') {
      throw new Error('ContentType is not supported. CNS supports only ipfs-ns');
    }

    const tokenId = namehash(name);
    const resolverContract = await getResolverContract(tokenId);
    const account = new ethers.Wallet(mnemonic, provider);

    if (dryrun) {
      return;
    }

    return resolverContract.connect(account)
      .set(ipfsKey, contentHash, tokenId);
  }
}

module.exports = CNS;
