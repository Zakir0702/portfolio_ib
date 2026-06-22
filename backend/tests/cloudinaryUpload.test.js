const assert = require('node:assert/strict');
const test = require('node:test');

const { buildCloudinaryUploadOptions } = require('../utils/cloudinaryUpload');

test('builds video upload options with eager poster generation', () => {
  const options = buildCloudinaryUploadOptions({
    type: 'video',
    key: 'showreel',
  });

  assert.equal(options.resource_type, 'video');
  assert.equal(options.folder, 'portfolio_ib');
  assert.match(options.public_id, /^showreel-/);
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
  assert.equal(options.eager, undefined);
});

