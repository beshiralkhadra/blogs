const router = require('express').Router();
const { register, login, me } = require('../controllers/user');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { registerValidator, loginValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', auth, me);

module.exports = router;
