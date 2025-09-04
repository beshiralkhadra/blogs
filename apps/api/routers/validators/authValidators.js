const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .exists().withMessage('name is required')
    .bail()
    .isString().withMessage('name must be a string')
    .bail()
    .isLength({ min: 2, max: 120 }).withMessage('name must be 2-120 chars'),
  body('email')
    .exists().withMessage('email is required')
    .bail()
    .isEmail().withMessage('email must be valid')
    .bail()
    .normalizeEmail(),
  body('password')
    .exists().withMessage('password is required')
    .bail()
    .isString().withMessage('password must be a string')
    .bail()
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters')
];

const loginValidator = [
  body('email')
    .exists().withMessage('email is required')
    .bail()
    .isEmail().withMessage('email must be valid')
    .bail()
    .normalizeEmail(),
  body('password')
    .exists().withMessage('password is required')
];

module.exports = { registerValidator, loginValidator };
