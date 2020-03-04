const updater = require('./updater');

test('throws when unknown name', async () => {
  await expect(updater.update('', ''))
    .rejects.toThrow('Name is unknown or empty');
});

test('throws when empty name', async () => {
  await expect(updater.update('', '', ''))
    .rejects.toThrow('Name is unknown or empty');
});

test('throws when not supported TLD', async () => {
  await expect(updater.update('', '', 'test.tes'))
    .rejects.toThrow('Not supported TLD');
});