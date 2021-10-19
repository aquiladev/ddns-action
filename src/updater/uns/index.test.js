const UNS = require('./');

jest.setTimeout(120000);

describe.skip('UNS: Integration tests', () => {
  test('test get content hash', async () => {
    const uns = new UNS({
      mnemonic: process.env.DEV_PKEY,
      rpc: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      name: 'udtestdev-ddns-action.x',
      verbose: true
    });
    const ch = await uns.getContenthash();
    console.log(ch)
  });

  test('test set content hash', async () => {
    const uns = new UNS({
      mnemonic: process.env.DEV_PKEY,
      rpc: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      name: 'udtestdev-ddns-action.x',
      verbose: true
    });
    const ch = await uns.setContenthash({ contentHash: 'QmRJFpRntf1EMgmC5Tm3Rzc438PRrYCMYZPb6nD4DeaNH6', contentType: 'ipfs-ns' });
    console.log(ch)
  });
});
