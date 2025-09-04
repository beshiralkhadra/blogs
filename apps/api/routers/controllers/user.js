const authService = require('../../services/authService');
const { toPublicUser } = authService;

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register({ name, email, password });
    return res.status(201).json({ success: true, message: 'Registration successful', data: { user, token } });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message || 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    return res.status(200).json({ success: true, message: 'Login successful', data: { user, token } });
  } catch (err) {
    const status = err.status || 500;
    const message = status === 401 ? 'Invalid credentials' : (err.message || 'Login failed');
    return res.status(status).json({ success: false, message });
  }
}

async function me(req, res) {
  return res.status(200).json({ success: true, data: { user: req.user } });
}

module.exports = { register, login, me, toPublicUser };
