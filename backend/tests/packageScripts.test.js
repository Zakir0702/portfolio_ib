const assert = require('node:assert/strict');
const test = require('node:test');

const pkg = require('../package.json');

test('Cloudinary-facing npm scripts use the system CA store', () => {
  assert.match(pkg.scripts.start, /node --use-system-ca server\.js/);
  assert.match(pkg.scripts['seed:media'], /node --use-system-ca scripts\/seedMedia\.js/);
});

