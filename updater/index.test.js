const updater = require('./');

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