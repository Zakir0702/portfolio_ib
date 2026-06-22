const assert = require('node:assert/strict');
const test = require('node:test');

const { buildCloudinaryUploadOptions, shouldUseLargeUpload } = require('../utils/cloudinaryUpload');

test('builds video upload options with eager poster generation', () => {
  const options = buildCloudinaryUploadOptions({
    type: 'video',
    key: 'showreel',
  });

  assert.equal(options.resource_type, 'video');
  assert.equal(options.folder, 'portfolio_ib');
  assert.match(options.public_id, /^showreel-/);
  assert.equal(options.timeout, 300000);
  assert.deepEqual(options.eager, [{ width: 900, crop: 'scale', format: 'jpg' }]);
});

test('builds image upload options without video eager transforms', () => {
  const options = buildCloudinaryUploadOptions({
    type: 'image',
    key: 'hero-image',
  });

  assert.equal(options.resource_type, 'image');
  assert.equal(options.folder, 'portfolio_ib');
  assert.match(options.public_id, /^hero-image-/);
  assert.equal(options.timeout, 300000);
  assert.equal(options.eager, undefined);
});

test('uses large upload path for large videos only', () => {
  assert.equal(shouldUseLargeUpload({ type: 'video', size: 40 * 1024 * 1024 }), true);
  assert.equal(shouldUseLargeUpload({ type: 'video', size: 5 * 1024 * 1024 }), false);
  assert.equal(shouldUseLargeUpload({ type: 'image', size: 40 * 1024 * 1024 }), false);
});
