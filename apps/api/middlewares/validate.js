const { validationResult } = require('express-validator');

/**
 * Express middleware that checks express-validator results.
 * If there are validation errors, responds with 422 and an errors array.
 * Otherwise, proceeds to the next handler.
 */
module.exports = function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
    value: e.value,
  }));

  return res.status(422).json({ success: false, message: 'Validation error', errors });
};
