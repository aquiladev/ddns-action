const cp = require('child_process');
const path = require('path');

describe.skip('DDNS: Integration tests', () => {
  test('test runs', () => {
    const ip = path.join(__dirname, 'index.js');
    console.log(ip)
    try {
      cp.execSync(`node ${ip}`, {
        env: {
          INPUT_MNEMONIC: process.env.DEV_PKEY,
          INPUT_RPC: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
          INPUT_NAME: 'ddns-action.eth',
          INPUT_CONTENTTYPE: 'ipfs-ns',
          INPUT_CONTENTHASH: 'QmWXBwcDSyDuiJhG4JAgJY7GBVbC6puyHQge1WD6rqv9nY',
          INPUT_DRYRUN: false,
          INPUT_VERBOSE: true
        },
        stdio: 'inherit'
      });
    } catch { 
        fail();
    }
  });
});