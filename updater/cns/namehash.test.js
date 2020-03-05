const { namehash } = require('./namehash');

test('test namehash', async () => {
  expect(namehash('crypto')).toEqual(
    '0x0f4a10a4f46c288cea365fcf45cccf0e9d901b945b9829ccdb54c10dc3cb7a6f',
  );
});