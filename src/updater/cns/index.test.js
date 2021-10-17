const CNS = require('./');

jest.setTimeout(120000);

describe.skip('CNS: Integration tests', () => {
  test('test get content hash', async () => {
    const cns = new CNS({
      mnemonic: process.env.DEV_PKEY,
      rpc: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      name: 'udtestdev-ddns-action.crypto',
      verbose: true
    });
    const ch = await cns.getContenthash();
    console.log(ch)
  });

  test('test set content hash', async () => {
    const cns = new CNS({
      mnemonic: process.env.DEV_PKEY,
      rpc: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      name: 'udtestdev-ddns-action.crypto',
      verbose: true
    });
    const ch = await cns.setContenthash({ contentHash: 'QmRJFpRntf1EMgmC5Tm3Rzc438PRrYCMYZPb6nD4DeaNH6', contentType: 'ipfs-ns' });
    console.log(ch)
  });
});
