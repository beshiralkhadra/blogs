const TokenService = require('../services/tokenService');
const { User } = require('../models');
const { toPublicUser } = require('../services/authService');

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers['authorization'] || '';
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const token = match[1];

    const ts = TokenService.getInstance();
    let payload;
    try {
      payload = ts.verify(token);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const userId = payload.sub;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = toPublicUser(user);
    req.auth = { token, payload };
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication middleware error' });
  }
}
