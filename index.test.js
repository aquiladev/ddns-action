const cp = require('child_process');
const path = require('path');

describe.skip('DDNS: Integration tests', () => {
  test('test runs', () => {
    const ip = path.join(__dirname, 'index.js');
    try {
      cp.execSync(`node ${ip}`, {
        env: {
          // INPUT_MNEMONIC: process.env.DEV_PKEY,
          // INPUT_RPC: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
          // INPUT_NAME: 'ddns-action.eth',
          // INPUT_CONTENTHASH: 'QmRJFpRntf1EMgmC5Tm3Rzc438PRrYCMYZPb6nD4DeaNH6',
          // INPUT_VERBOSE: true
        }
      })
      fail();
    } catch { }
  });
});
