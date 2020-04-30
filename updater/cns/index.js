const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const registryABI = require('./registry.json');
const resolverABI = require('./resolver.json');
const { namehash } = require('./namehash');

const registry = '0xD1E5b0FF1287aA9f9A268759062E4Ab08b9Dacbe';
const ipfsKey = 'ipfs.html.value';

function CNS(options) {
  const { mnemonic, rpc, name, gasPrice, dryrun, verbose } = options;

  const provider = new HDWalletProvider(mnemonic, rpc);
  const web3 = new Web3(provider);
  const registryContract = new web3.eth.Contract(registryABI, registry);

  const getResolver = (tokenId) => {
    return registryContract.methods.resolverOf(tokenId)
      .call({ from: provider.addresses[0] });
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

    return new web3.eth.Contract(resolverABI, resolver);
  }

  this.getContenthash = async () => {
    if (verbose) {
      console.log('Getting content...')
    }

    const tokenId = namehash(name);
    const resolverContract = await getResolverContract(tokenId);

    return resolverContract.methods.get(ipfsKey, tokenId)
      .call({ from: provider.addresses[0] });
  }

  this.setContenthash = async ({ contentHash, contentType }) => {
    if (contentType !== 'ipfs-ns') {
      throw new Error('ContentType is not supported. CNS supports only ipfs-ns');
    }

    const tokenId = namehash(name);
    const resolverContract = await getResolverContract(tokenId);

    if (dryrun) {
      return;
    }

    return resolverContract.methods.set(ipfsKey, contentHash, tokenId)
      .send({ from: provider.addresses[0], gasPrice });
  }
}

module.exports = CNS;