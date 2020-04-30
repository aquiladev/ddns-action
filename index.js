const run = require('./runner');

try {
  run();
  process.exit(0);
} catch (_) {
  process.exit(1);
}