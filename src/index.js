const run = require('./runner');

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
