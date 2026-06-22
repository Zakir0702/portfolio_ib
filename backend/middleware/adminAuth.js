function extractBearerToken(authHeader = '') {
  const match = String(authHeader).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function isWriteAuthorized({
  configuredToken = process.env.ADMIN_UPLOAD_TOKEN || '',
  authHeader = '',
  nodeEnv = process.env.NODE_ENV || 'development',
} = {}) {
  const token = String(configuredToken || '').trim();

  if (!token && nodeEnv === 'production') {
    return {
      authorized: false,
      status: 503,
      message: 'Media write API is not configured.',
    };
  }

  if (!token) {
    return { authorized: true };
  }

  if (extractBearerToken(authHeader) === token) {
    return { authorized: true };
  }

  return {
    authorized: false,
    status: 401,
    message: 'Unauthorized media write request.',
  };
}

function requireAdminToken(req, res, next) {
  const result = isWriteAuthorized({ authHeader: req.get('authorization') || '' });
  if (result.authorized) return next();
  return res.status(result.status).json({ success: false, message: result.message });
}

module.exports = { extractBearerToken, isWriteAuthorized, requireAdminToken };

