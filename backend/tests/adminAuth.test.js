const assert = require('node:assert/strict');
const test = require('node:test');

const { isWriteAuthorized } = require('../middleware/adminAuth');

test('authorizes writes when bearer token matches configured admin token', () => {
  assert.equal(
    isWriteAuthorized({
      configuredToken: 'secret-token',
      authHeader: 'Bearer secret-token',
      nodeEnv: 'production',
    }).authorized,
    true
  );
});

test('rejects writes when configured token is missing in production', () => {
  const result = isWriteAuthorized({
    configuredToken: '',
    authHeader: '',
    nodeEnv: 'production',
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 503);
});

test('rejects writes when bearer token does not match', () => {
  const result = isWriteAuthorized({
    configuredToken: 'secret-token',
    authHeader: 'Bearer wrong-token',
    nodeEnv: 'production',
  });

  assert.equal(result.authorized, false);
  assert.equal(result.status, 401);
});

test('allows local development writes when no token is configured', () => {
  assert.equal(
    isWriteAuthorized({
      configuredToken: '',
      authHeader: '',
      nodeEnv: 'development',
    }).authorized,
    true
  );
});

