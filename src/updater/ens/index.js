const { ethers } = require('ethers');
const { encode } = require('content-hash');

const { namehash } = require('../../utils/namehash');

function ENS(options) {
  const { mnemonic, rpc, name, dryrun, verbose } = options;

  const provider = new ethers.providers.JsonRpcProvider(rpc);

  this.getContenthash = async () => {
    if (verbose) {
      console.log('Getting content...')
    }

    const resolver = await provider.getResolver(name);
    return resolver.getContentHash(name);
  }

  this.setContenthash = async ({ contentHash, contentType }) => {
    let encodedHash;
    try {
        encodedHash = '0x' + encode(contentType, contentHash)
    } catch(error) {
        throw Error(`\tError encoding ${contentType} - ${contentHash}: ${error}`)
    }

    if (verbose) {
      console.log(`Updating content hash to ${contentHash}`)
      console.log(`    ${encodedHash} - ${contentType}`)
    }

    const tokenId = namehash(name);
    const resolver = await provider.getResolver(name);
    const account = new ethers.Wallet(mnemonic, provider);

    if (dryrun) {
      return;
    }

    return account.sendTransaction({
      to: resolver.address,
      data: ethers.utils.hexConcat([
        '0x304e6ade',
        ethers.utils.defaultAbiCoder.encode(['bytes32', 'bytes'], [tokenId, encodedHash])
      ])
    });
  }
}

module.exports = ENS;
