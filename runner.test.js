const run = require('./runner');

jest.setTimeout(240000);

describe('DDNS: Integration tests', () => {
  it('test runs', async () => {
    process.env['INPUT_MNEMONIC'] = process.env.DEV_PKEY;
    process.env['INPUT_RPC'] = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    process.env['INPUT_NAME'] = 'ddns-action.eth';
    process.env['INPUT_CONTENTTYPE'] = 'ipfs-ns';
    process.env['INPUT_CONTENTHASH'] = 'QmRJFpRntf1EMgmC5Tm3Rzc438PRrYCMYZPb6nD4DeaNH6';
    process.env['INPUT_DRYRUN'] = true;
    process.env['INPUT_VERBOSE'] = true;
    await run();
  });
});
