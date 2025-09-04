const jwt = require('jsonwebtoken');

class TokenService {
  static instance;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
    this.issuer = process.env.JWT_ISS || 'blogs-api';
    this.audience = process.env.JWT_AUD || 'blogs-client';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  }

  static getInstance() {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  sign(payload, options = {}) {
    const base = {
      issuer: this.issuer,
      audience: this.audience,
      algorithm: 'HS256',
      expiresIn: this.expiresIn,
    };
    return jwt.sign(payload, this.secret, { ...base, ...options });
  }

  verify(token, options = {}) {
    const base = {
      issuer: this.issuer,
      audience: this.audience,
      algorithms: ['HS256'],
    };
    return jwt.verify(token, this.secret, { ...base, ...options });
  }
}

module.exports = TokenService;
