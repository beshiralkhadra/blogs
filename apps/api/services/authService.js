
const bcrypt = require('bcryptjs');
const TokenService = require('./tokenService');
const { User } = require('../models');

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

async function register({ name, email, password }) {
  const normalizedEmail = String(email).toLowerCase();
  const existing = await User.findOne({ where: { email: normalizedEmail } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ name, email: normalizedEmail, passwordHash });

  const ts = TokenService.getInstance();
  const token = ts.sign({ sub: user.id, email: user.email, name: user.name });
  return { user: toPublicUser(user), token };
}

async function login({ email, password }) {
  const normalizedEmail = String(email).toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ts = TokenService.getInstance();
  const token = ts.sign({ sub: user.id, email: user.email, name: user.name });
  return { user: toPublicUser(user), token };
}

module.exports = { register, login, toPublicUser };
