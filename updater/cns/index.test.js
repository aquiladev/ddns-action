const CNS = require('./');

jest.setTimeout(120000);

test('test get content hash', async () => {
  const cns = new CNS({
    mnemonic: process.env.DEV_PKEY,
    rpc: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    name: 'ddns-action.crypto',
    verbose: true
  });
  const ch = await cns.getContenthash();
  console.log(ch)
});

test.skip('test set content hash', async () => {
  const cns = new CNS({
    mnemonic: process.env.DEV_PKEY,
    rpc: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    name: 'ddns-action.crypto',
    contentHash: 'QmRJFpRntf1EMgmC5Tm3Rzc438PRrYCMYZPb6nD4DeaNH6',
    verbose: true
  });
  const ch = await cns.setContenthash();
  console.log(ch)
});