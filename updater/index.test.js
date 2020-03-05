const updater = require('./');

jest.setTimeout(120000);

test('throws when unknown name', async () => {
  await expect(updater.update({}))
    .rejects.toThrow('Name is unknown or empty');
});

test('throws when empty name', async () => {
  await expect(updater.update({}))
    .rejects.toThrow('Name is unknown or empty');
});

test('throws when not supported TLD', async () => {
  await expect(updater.update({ name: 'test.tes' }))
    .rejects.toThrow('Not supported TLD');
});

test('throws when contentHash is empty', async () => {
  await expect(updater.update({ name: 'test.eth' }))
    .rejects.toThrow('ContentHash is unknown or empty');
});

describe.only('Updater: Integration tests', () => {
  test('test', async () => {
    await updater.update({
      mnemonic: process.env.DEV_PKEY,
      rpc: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      name: 'ddns-action.eth',
      contentHash: 'QmRJFpRntf1EMgmC5Tm3Rzc438PRrYCMYZPb6nD4DeaNH6',
      verbose: true
    });
  });
});